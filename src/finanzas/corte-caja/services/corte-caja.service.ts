import { Injectable, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CobroService } from '../../cobro/services/cobro.service';
import { GastosService } from '../../gastos/gastos.service';
import { IngresosService } from '../../ingresos/ingresos.service';
import { MovimientoCajaService } from '../../movimiento-caja/movimiento-caja.service';
import { CreateCorteCajaDetalle, CreateCorteCajaDto } from '../dto/create-corte-caja.dto';
import { CorteCaja } from '../entities/corte-caja.entity';
import { EgresosService } from '../../egresos/egresos.service';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { CuentasPorCobrarService } from 'src/creditos/cuentas-por-cobrar/cuentas-por-cobrar.service';
import { ConfiguracionesGlobalService } from 'src/configuraciones/configuraciones-global/configuraciones-global.service';
import { User } from 'src/user/entities/user.entity';
import { EfectivoService } from '../../fondos/efectivo/efectivo.service';
import { CreateEfectivoDto } from '../../fondos/efectivo/dto/create-efectivo.dto';
import { CreateDetalleEfectivoDto } from '../../fondos/efectivo/dto/create-detalle-efectivo.dto';
import { Caja } from '../../caja/entities/caja.entity';
import { CobroConsultService } from '../../cobro/services/cobro-consult.service';


@Injectable()
export class CorteCajaService {

  constructor(
    @InjectRepository(CorteCaja)
    public readonly corteCajaRepository: Repository<CorteCaja>,
    private readonly movimientoCajaService: MovimientoCajaService,
    @Inject(forwardRef(() => CobroService))
    private readonly cobroService:CobroService,
    private readonly cobroConsultService:CobroConsultService,
    private readonly ingresosService:IngresosService,
    private readonly egresosService:EgresosService,
    private readonly cuentasPorCobrarService:CuentasPorCobrarService,
    private readonly configuracionesGlobalService:ConfiguracionesGlobalService,
    private readonly efectivoService:EfectivoService,

  ) {}

  /* ############################################ FUNCIONES USADAS EN CONTROLADORES ############################################*/

  @Transactional()
  async create(createCorteCajaDto: CreateCorteCajaDto, monto:number, user:User){
    let {caja} = createCorteCajaDto 
    const saldo = await this.lastCorte(caja.id).then(a=>a.corteCajaDetalle.find((b)=>b.concepto ==='SALDO'));  
    const {cobroBanco, cuentaPorCobrarBanco, cobro, ingreso, egreso, cuentaPorCobrar, cobroEfectivo, cuentaPorCobrarEfectivo} = await this.transaccionesSinCorte(caja);
    const dinero = Number(cobroEfectivo) + Number(ingreso) + Number(cuentaPorCobrarEfectivo) + Number(saldo.monto);
    if(monto>dinero) throw new BadRequestException('El monto no puede ser mayor al que se quiere retirar!')
    const banco = Number(cobroBanco) + Number(cuentaPorCobrarBanco)
    let detalle: CreateCorteCajaDetalle[] = [
      {monto: saldo.monto, concepto: 'SALDO INICIAL', type :true},
      {monto: Number(cobro), concepto: 'VENTAS', type :true},      
      {monto: Number(cuentaPorCobrar), concepto: 'CUENTAS POR COBRAR', type :true},
      {monto: Number(ingreso), concepto: 'INGRESOS', type :true},      
      {monto: Number(egreso), concepto: 'EGRESOS', type :false},
      {monto: Number(banco), concepto: 'BANCOS', type :false},
      {monto: Number(monto), concepto: 'MONTO A RETIRAR', type :false},
      {monto: Number(dinero - monto), concepto: 'SALDO', type :true},
    ]
    const data = detalle.filter((det)=>det.monto !== 0 && det.monto != null)
    createCorteCajaDto.corteCajaDetalle = data;
    const corte = await this.corteCajaRepository.save(createCorteCajaDto);
    await this.cobros(corte);
    await this.ingresos(corte);    
    await this.egresos(corte);    
    await this.cuentasPorCobrar(corte);
    const {efectivo} = await this.configuracionesGlobalService.getConfiguraciones(user);
    let createDetalleEfectivoDto:CreateDetalleEfectivoDto = {
      documento: `${corte.id}`,
      descripcion: 'INGRESO POR CORTE DE CAJA',
      monto,
      type: true
    }
    if(!efectivo) throw new BadRequestException('Debe registrar una cuenta en efectivo por defecto')
    
    const montoMovimiento = Number(monto) + Number(banco)
    await this.efectivoService.transaccion(createDetalleEfectivoDto, user, efectivo.id);
    await this.movimientoCajaService.create(montoMovimiento, `EGRESO CORTE NO. ${corte.id}`, 2, createCorteCajaDto.caja, false)
  }

  async transaccionesSinCorte(caja:Caja){
    const {balance} = await this.movimientoCajaService.ultimoMovimiento(caja.id);
    const {cobro} = await this.totalCobro(caja.id);
    const {cobroBanco} = await this.totalCobroBanco(caja.id);
    const {cobroEfectivo} = await this.totalCobroEfectivo(caja.id);
    const {ingreso} = await this.totalIngresos(caja.id);
    const {egreso} = await this.totalEgresos(caja.id);
    const {cuentaPorCobrar} = await this.totalCuentasPorCobrar(caja.id);
    const {cuentaPorCobrarEfectivo} = await this.totalCuentasPorCobrarEfectivo(caja.id);
    const {cuentaPorCobrarBanco} = await this.totalCuentasPorCobrarBanco(caja.id);
    return {balance, cobro, ingreso, egreso, cuentaPorCobrar, cobroBanco, cobroEfectivo, cuentaPorCobrarEfectivo, cuentaPorCobrarBanco}
  }

  async lastCorte(id:number){
    return await this.corteCajaRepository.createQueryBuilder("corte_caja")
    .leftJoinAndSelect("corte_caja.empleado", "empleado")
    .leftJoinAndSelect("corte_caja.corteCajaDetalle", "corteCajaDetalle")
    .select(["corte_caja.fechas", "corte_caja.id", "empleado.nombre", "empleado.apellido"])
    .addSelect("corteCajaDetalle")
    .where("corte_caja.caja.id = :id", {id})
    .andWhere((qb)=>{const subQuery= qb.subQuery()
                  .select("MAX(corte_caja.fecha)", "fechas")
                  .from(CorteCaja, "corte_caja")
                  .where("corte_caja.caja.id = :id", {id})
                  .getQuery()
                  return "corte_caja.fechas = " + subQuery})
    .getOne() 
}

/* ############# */
  async totalCobro(id:number){
    return await this.cobroConsultService.totalCobro(id)
  }
  async totalCobroEfectivo(id:number){
    return await this.cobroConsultService.totalCobroEfectivo(id)
  }
  async totalCobroBanco(id:number){
    return await this.cobroConsultService.totalCobroBanco(id)
  }
/* ############# */


  async totalIngresos(id:number){
    return await this.ingresosService.totalIngresos(id)
  }

  async totalEgresos(id:number){
    return await this.egresosService.totalEgresos(id)
  }

/* ############# */
  async totalCuentasPorCobrar(id:number){
    return await this.cuentasPorCobrarService.totalCuentasPorCobrar(id);
  }

  async totalCuentasPorCobrarEfectivo(id:number){
    return await this.cuentasPorCobrarService.totalCuentasPorCobrarEfectivo(id);
  }

  async totalCuentasPorCobrarBanco(id:number){
    return await this.cuentasPorCobrarService.totalCuentasPorCobrarBanco(id);
  }
/* ############# */
  async ultimoMovimiento(id:number){
    return this.movimientoCajaService.ultimoMovimiento(id);
  }

  /*############################################ MARCAR LOS QUE NO TIENEN CORTE############################################ */

  async cobros(corte:CorteCaja ){
    return await this.cobroService.cobros(corte)
  }

  async ingresos(corte:CorteCaja ){
    return await this.ingresosService.ingresos(corte);
  }

  async egresos(corte:CorteCaja ){
    return await this.egresosService.egresos(corte);
  }

  async cuentasPorCobrar(corte:CorteCaja){
    return await this.cuentasPorCobrarService.cuentasPorCobrar(corte);
  }  

  /*############################################ DETALLE CORTE ############################################ */
  
  async ventasCobrosCorte(idCaja:number, idCorte:number){
    return await this.cobroConsultService.ventasCobrosCorte(idCaja, idCorte);

  }
  
  async ingresosCorte(idCorte:number, idCaja:number){
    return await this.ingresosService.ingresosCorte(idCorte, idCaja);
  }

  async egresosCorte(idCorte:number, idCaja:number){
    return await this.egresosService.egresosCorte(idCorte, idCaja);
  }

  async cuentasPorCobrarCorte(idCorte:number, idCaja:number){
    return await this.cuentasPorCobrarService.cuentasPorCobrarCorte(idCorte, idCaja);
  }

  /*############################################ FUNCIONES USADAS FUERA DE SU MODULO (CAJA) ############################################*/
  
  @Transactional({propagation: Propagation.MANDATORY})
  async save(corte:CreateCorteCajaDto){
    return this.corteCajaRepository.save(corte)
  }

}