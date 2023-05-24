import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CobroService } from '../cobro/cobro.service';
import { GastosService } from '../gastos/gastos.service';
import { IngresosService } from '../ingresos/ingresos.service';
import { MovimientoCajaService } from '../movimiento-caja/movimiento-caja.service';
import { CreateCorteCajaDetalle, CreateCorteCajaDto } from './dto/create-corte-caja.dto';
import { CorteCaja } from './entities/corte-caja.entity';
import { EgresosService } from '../egresos/egresos.service';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { CuentasPorCobrarService } from 'src/creditos/cuentas-por-cobrar/cuentas-por-cobrar.service';


@Injectable()
export class CorteCajaService {

  constructor(
    @InjectRepository(CorteCaja)
    public readonly corteCajaRepository: Repository<CorteCaja>,
    private readonly movimientoCajaService: MovimientoCajaService,
    private readonly cobroService:CobroService,
    private readonly gastosService:GastosService,
    private readonly ingresosService:IngresosService,
    private readonly egresosService:EgresosService,
    private readonly cuentasPorCobrarService:CuentasPorCobrarService
  ) {}

  /* ############################################ FUNCIONES USADAS EN CONTROLADORES ############################################*/

  @Transactional()
  async create(createCorteCajaDto: CreateCorteCajaDto, monto:number){
    let {caja} = createCorteCajaDto    
    const {balance} = await this.movimientoCajaService.ultimoMovimiento(caja.id);
    const {total} = await this.totalCobro(caja.id);
    const {gasto} = await this.totalGasto(caja.id);
    const {ingreso} = await this.totalIngresos(caja.id);
    const {egreso} = await this.totalEgresos(caja.id);
    const {cuentaPorCobrar} = await this.totalCuentasPorCobrar(caja.id);
    if(monto>balance) throw new BadRequestException('El monto no puede ser mayor al que se quiere retirar!')
    let detalle: CreateCorteCajaDetalle[] = [
      {monto: balance, concepto: 'SALADO CAJA', type :true},
      {monto: Number(total), concepto: 'VENTAS', type :true},      
      {monto: Number(ingreso), concepto: 'INGRESOS', type :true},      
      {monto: Number(gasto), concepto: 'GASTOS', type :false},
      {monto: Number(egreso), concepto: 'EGRESOS', type :false},
      /* {monto: Number(cuentaPorCobrar), concepto: 'CUENTAS POR COBRAR', type :true}, */
      {monto: Number(monto), concepto: 'MONTO A RETIRAR', type :false},
    ]
    const data = detalle.filter((det)=>det.monto !== 0 && det.monto != null)
    createCorteCajaDto.corteCajaDetalle = data;
    const corte = await this.corteCajaRepository.save(createCorteCajaDto);
    await this.cobros(corte);
    await this.gastos(corte);    
    await this.ingresos(corte);    
    await this.egresos(corte);    
    await this.cuentasPorCobrar(corte);    
    await this.movimientoCajaService.create(monto, `EGRESO CORTE NO. ${corte.id}`, 2, createCorteCajaDto.caja, false)
  }

  //TODO:USANDO
  async lastCorte(id:number){
    return await this.corteCajaRepository.createQueryBuilder("corte_caja")
    .leftJoinAndSelect("corte_caja.empleado", "empleado")
    .select(["corte_caja.fechas", "corte_caja.id", "empleado.nombre", "empleado.apellido"])
    .where("corte_caja.caja.id = :id", {id})
    .andWhere((qb)=>{const subQuery= qb.subQuery()
                  .select("MAX(corte_caja.fecha)", "fechas")
                  .from(CorteCaja, "corte_caja")
                  .where("corte_caja.caja.id = :id", {id})
                  .getQuery()
                  return "corte_caja.fechas = " + subQuery})
    .getOne() 
  }  

  async totalGasto(id:number){
    return await this.gastosService.totalGasto(id);
  }

  async totalCobro(id:number){
    return await this.cobroService.totalCobro(id)
  }

  async saldo(id:number){
    const {total} = await this.totalCobro(id);
    let {balance} = await this.ultimoMovimiento(id);
    balance = Number(balance-total)
    const {gasto} = await this.totalGasto(id);
    balance += Number(gasto);
    const {egreso} = await this.totalEgresos(id);
    balance += Number(egreso);
    const {ingreso} = await this.totalIngresos(id);
    balance -= Number(ingreso);
    const {cuentaPorCobrar} = await this.totalCuentasPorCobrar(id);
    balance -= Number(cuentaPorCobrar);
    return balance;
  }


  async totalIngresos(id:number){
    return await this.ingresosService.totalIngresos(id)
  }

  async totalEgresos(id:number){
    return await this.egresosService.totalEgresos(id)
  }

  async totalCuentasPorCobrar(id:number){
    return await this.cuentasPorCobrarService.totalCuentasPorCobrar(id);
  }

  async ultimoMovimiento(id:number){
    return this.movimientoCajaService.ultimoMovimiento(id);
  }

  async findAll(start: Date, end:Date, id:number) {
    const st = new Date(start)
    const en = new Date(end)
    en.setDate(en.getDate() + 1);
    return await this.corteCajaRepository.createQueryBuilder("corte_caja")
    .leftJoin("corte_caja.empleado", "empleado")
    .leftJoin("corte_caja.caja", "caja")
    .leftJoin("corte_caja.corteCajaDetalle", "corteCajaDetalle")
    .select(["corte_caja", "empleado.nombre", "empleado.apellido", "corteCajaDetalle"])
    .where("caja.id = :id", {id})
    .andWhere("corte_caja.fechas >= :st", {st})
    .andWhere("corte_caja.fechas < :en", {en})
    .having("corteCajaDetalle.concepto = :string", {string: "MONTO A RETIRAR"})
    .orderBy("corte_caja.fechas", "ASC")
    .groupBy("corte_caja.id, empleado.id, corteCajaDetalle.id")
    .getMany()
  }

  async findOne(id:number){
    const corte = await this.corteCajaRepository.createQueryBuilder("corte_caja")
    .leftJoin("corte_caja.empleado", "empleado")
    .leftJoin("corte_caja.caja", "caja")
    .leftJoin("caja.empleado", "cajaEmpleado")
    .leftJoin("corte_caja.corteCajaDetalle", "corteCajaDetalle")
    .select(["corte_caja", "corteCajaDetalle","empleado.nombre", "empleado.apellido", "caja.id", "caja.lugar", "cajaEmpleado.nombre", "cajaEmpleado.apellido"])
    .where({id})
    .orderBy('corteCajaDetalle.id', 'ASC')
    .getOne()
    for (let i = 0; i < corte.corteCajaDetalle.length; i++) {
      corte.corteCajaDetalle[i].monto = Number(corte.corteCajaDetalle[i].monto)
      const element = corte.corteCajaDetalle[i];
      if(element.concepto === 'VENTAS' && corte.corteCajaDetalle[0].concepto ==='SALADO CAJA'){                
        corte.corteCajaDetalle[0].monto -= corte.corteCajaDetalle[i].monto 
      }
      if(element.concepto === 'GASTOS' && corte.corteCajaDetalle[0].concepto ==='SALADO CAJA'){
        corte.corteCajaDetalle[0].monto += corte.corteCajaDetalle[i].monto
      }
      if(element.concepto === 'EGRESOS' && corte.corteCajaDetalle[0].concepto ==='SALADO CAJA'){
        corte.corteCajaDetalle[0].monto += corte.corteCajaDetalle[i].monto
      }
      if(element.concepto === 'INGRESOS' && corte.corteCajaDetalle[0].concepto ==='SALADO CAJA'){
        corte.corteCajaDetalle[0].monto -= corte.corteCajaDetalle[i].monto
      }
      if(element.concepto === 'CUENTAS POR COBRAR' && corte.corteCajaDetalle[0].concepto ==='SALADO CAJA'){
        corte.corteCajaDetalle[0].monto -= corte.corteCajaDetalle[i].monto
      }
    }
    return corte;
  }

  async ventasCobrosCorte(idCaja:number, idCorte:number){
    return await this.cobroService.ventasCobrosCorte(idCaja, idCorte);

  }

  async gastosCorte(idCorte:number, idCaja:number){
    return await this.gastosService.gastosCorte(idCorte, idCaja);
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

  /*############################################ FUNCIONES EXTRAS############################################ */

  async cobros(corte:CorteCaja ){
    return await this.cobroService.cobros(corte)
  }

  async gastos(corte:CorteCaja ){
    return await this.gastosService.gastos(corte);
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

  /*############################################ FUNCIONES USADAS FUERA DE SU MODULO ############################################*/
  
  @Transactional({propagation: Propagation.MANDATORY})
  async save(corte:CreateCorteCajaDto){
    return this.corteCajaRepository.save(corte)
  }

}