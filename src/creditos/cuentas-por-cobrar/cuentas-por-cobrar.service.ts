import { Injectable, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateCuentasPorCobrarDto } from './dto/create-cuentas-por-cobrar.dto';
import { UpdateCuentasPorCobrarDto } from './dto/update-cuentas-por-cobrar.dto';
import { CuentaPorCobrarDetalle } from './entities/cuenta-por-cobrar-details.entity';
import { CuentaPorCobrar } from './entities/cuenta-por-cobrar.entity';
import { Cliente } from '../../ventas/cliente/entity/cliente.entity';
import { Venta } from '../../ventas/venta/entity/venta.entity';
import { IngresosService } from 'src/finanzas/ingresos/ingresos.service';
import { MovimientoCajaService } from 'src/finanzas/movimiento-caja/movimiento-caja.service';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { Caja } from 'src/finanzas/caja/entities/caja.entity';
import { CorteCaja } from 'src/finanzas/corte-caja/entities/corte-caja.entity';
import { Sucursal } from '../../sucursal/entity/sucursal.entity';
import { Empleado } from '../../recursos-humanos/empleado/entity/empleado.entity';
import { CreditoClienteService } from '../credito-cliente/credito-cliente.service';


@Injectable()
export class CuentasPorCobrarService {
  constructor(
    @InjectRepository(CuentaPorCobrar)
    private readonly cuentaPorCobrarRepository:Repository<CuentaPorCobrar>,
    @InjectRepository(CuentaPorCobrarDetalle)
    private readonly cuentaPorCobrarDetalleRepository:Repository<CuentaPorCobrarDetalle>,
    private readonly movimientoCajaService: MovimientoCajaService,
    @Inject(forwardRef(() => CreditoClienteService))
    private readonly creditoClienteService:CreditoClienteService 
  ){}


  @Transactional({propagation: Propagation.MANDATORY})
  async create(venta:Venta, empleado:Empleado){
    const dias = await this.creditoClienteService.findOne(venta.cliente, empleado.sucursal)
    const date = new Date();
    date.setDate(date.getDate() + dias.diasCredito);
    const balance = venta.detalle.reduce((sum, a)=> sum +  Number(a.cantidad * a.precio_venta), 0.00);
    const cuentaPorCobrar: CuentaPorCobrar = {
      fechaFinal: date, 
      cliente: venta.cliente, 
      venta,
      cuentaPorCobrarDetalle: [{descripcion: 'CREDITO',monto: 0,balance: balance,}],
      sucursal: venta.sucursal
    }        
    return await this.cuentaPorCobrarRepository.save(cuentaPorCobrar);      
  }

  async getCuentasPorCobrarbyCliente(id:number, sucursal:Sucursal, checked:boolean, start?: Date, end?:Date){
    const st = new Date(start)
    const en = new Date(end)
    en.setDate(en.getDate() + 1);  
    const data:any[] = await this.cuentaPorCobrarRepository.createQueryBuilder('cuentas_por_cobrar')
        .innerJoin('cuentas_por_cobrar.cliente', 'cliente')
        .innerJoin('cuentas_por_cobrar.venta', 'venta')
        .innerJoin('venta.detalle', 'detalle')
        .select(['cuentas_por_cobrar.id as id', 'cuentas_por_cobrar.fechaInicio as fechaInicio', 'cuentas_por_cobrar.fechaFinal as fechaFinal', 
        'cuentas_por_cobrar.estado as estado', 'venta.id as ventaId'
        ,'cliente.nombre as cliente', 'SUM(detalle.cantidad*detalle.precio_venta) AS total'])
        .addSelect((sub)=>{
            return sub.select("SUM(cuentas_por_cobrar_det.monto)", "pagos")
                      .from(CuentaPorCobrarDetalle, "cuentas_por_cobrar_det")
                      .where("cuentas_por_cobrar_det.cuentaPorCobrar = cuentas_por_cobrar.id")
        }, "pagos")                                          
        .where("cliente.id = :id", {id})
        .andWhere("cuentas_por_cobrar.sucursal.id = :idSucursal", {idSucursal: sucursal.id})
        .andWhere("cuentas_por_cobrar.estado = :checked", {checked})
        .andWhere(checked? "cuentas_por_cobrar.fechaInicio >= :st": 'TRUE',  {st})            
        .andWhere(checked? "cuentas_por_cobrar.fechaInicio < :en": 'TRUE',  {en})            
        .groupBy('cuentas_por_cobrar.id, cliente.id, venta.id')
        .getRawMany();  
    data.forEach(r=>r.saldo = r.total-r.pagos)                
    return data   
  }

  async getTodostCuentasPorCobrar(sucursal:Sucursal){
    const data:any[] = await this.cuentaPorCobrarRepository.createQueryBuilder('cuentas_por_cobrar')
        .innerJoin('cuentas_por_cobrar.cliente', 'cliente')
        .innerJoin('cuentas_por_cobrar.venta', 'venta')
        .innerJoin('venta.detalle', 'detalle')
        .select(['cuentas_por_cobrar.id as id', 'cuentas_por_cobrar.fechaInicio as fechaInicio', 'cuentas_por_cobrar.fechaFinal as fechaFinal', 
        'cuentas_por_cobrar.estado as estado', 'venta.id as ventaId'
        ,'cliente.nombre as cliente', 'SUM(detalle.cantidad*detalle.precio_venta) AS total'])
        .addSelect((sub)=>{
            return sub.select("SUM(cuentas_por_cobrar_det.monto)", "pagos")
                      .from(CuentaPorCobrarDetalle, "cuentas_por_cobrar_det")
                      .where("cuentas_por_cobrar_det.cuentaPorCobrar = cuentas_por_cobrar.id")
        }, "pagos")                                          
        .where("cuentas_por_cobrar.sucursal.id = :idSucursal", {idSucursal: sucursal.id})
        .andWhere("cuentas_por_cobrar.estado = FALSE")            
        .groupBy('cuentas_por_cobrar.id, cliente.id, venta.id')
        .getRawMany();  
    data.forEach(r=>r.saldo = r.total-r.pagos)                
    return data
  }

  @Transactional()
  async pagarCreditos(cuentasPorCobrarDetalle:CreateCuentasPorCobrarDto[], caja:Caja){
    let array:CuentaPorCobrar[] = []
    cuentasPorCobrarDetalle.forEach(r=>{
      array.push({ id:r.cuentaPorCobrar.id, estado:r.estado})
    })
    const creditos = await this.cuentaPorCobrarRepository.save(array);
    const cuentas = await this.cuentaPorCobrarDetalleRepository.save(cuentasPorCobrarDetalle);
    let descripcion:string='';
    creditos.forEach(r=>descripcion+=` ${r.id},`);
    descripcion = descripcion.substring(0, descripcion.length - 1);
    const total = cuentas.reduce((sum, a)=> sum +  a.monto, 0.00) 
    return  this.movimientoCajaService.create(total, `INGRESO POR PAGO DE CREDITO(S) NO. ${descripcion}`, 1, caja, true);   
  }

  @Transactional()
  async pagarCredito(cuentaPorCobrarDetalle:CreateCuentasPorCobrarDto){
      const lastCuentaPorCobrarDet = await this.cuentaPorCobrarDetalleRepository.createQueryBuilder('cuentas_por_cobrar_detalle')
        .select()
        .where((qb)=>{
          const subQuery= qb.subQuery()
                  .select("MAX(detalle.fecha)", "fecha")
                  .from(CuentaPorCobrarDetalle, "detalle")
                  .where("detalle.cuentaPorCobrar.id = :id", {id: cuentaPorCobrarDetalle.cuentaPorCobrar.id})
                  .getQuery()
                  return "cuentas_por_cobrar_detalle.fecha = " + subQuery
        })
        .getOne();
      const saldo =  Number(lastCuentaPorCobrarDet.balance) - cuentaPorCobrarDetalle.monto; 
      if( cuentaPorCobrarDetalle.monto >= lastCuentaPorCobrarDet.balance) throw new BadRequestException('El monto debe ser diferente')
      cuentaPorCobrarDetalle.balance =  saldo; 
      const cuentaPorCobrarDet = await this.cuentaPorCobrarDetalleRepository.save(cuentaPorCobrarDetalle) 
      return await this.movimientoCajaService.create(cuentaPorCobrarDet.monto, `INGRESO POR CREDITO ${cuentaPorCobrarDet.descripcion} NO. ${cuentaPorCobrarDet.id}, CREDITO NO.${cuentaPorCobrarDetalle.cuentaPorCobrar.id}`, 1, cuentaPorCobrarDetalle.caja, true) ;         
  }

  async pagosDetail(id:number){
    return await this.cuentaPorCobrarDetalleRepository.find({
      where: {cuentaPorCobrar: {id}},
      order: {fecha: 'ASC'}
    })
  }

  /* FUNCIONES USADAS FUERA DE SU MODULO*/

  async totalCuentasPorCobrar(id:number){
    return await this.cuentaPorCobrarDetalleRepository.createQueryBuilder("cuentas_por_cobrar_detalle")                                
    .leftJoinAndSelect("cuentas_por_cobrar_detalle.caja", "caja")
    .leftJoinAndSelect("cuentas_por_cobrar_detalle.corteCaja", "corte")
    .select('SUM(cuentas_por_cobrar_detalle.monto)', 'cuentaPorCobrar')
    .where('caja.id = :id', {id})
    .andWhere('corte.id is null')
    .getRawOne()
  }

  async cuentasPorCobrarCorte(idCorte:number, idCaja:number){
    return await this.cuentaPorCobrarDetalleRepository.find({
      loadRelationIds: {
        relations: ['cuentaPorCobrar']
      },
      where: { caja: {id: idCaja}, corteCaja: {id: idCorte}},
      order: {fecha: 'ASC'}
    });
  }
  
  async cuentasPorCobrar(corte:CorteCaja){
    const cuentasPorCobrar = await this.cuentaPorCobrarDetalleRepository.find({
      relations: ["corteCaja"], 
      where: { caja: {id: corte.caja.id}, corteCaja: {id: IsNull()}}
    });
    if(cuentasPorCobrar) {
      cuentasPorCobrar.map(egreso=> egreso.corteCaja = corte)
      await this.cuentaPorCobrarDetalleRepository.save(cuentasPorCobrar);
    };
  }

  async totalCuentasPorCobrarCliente(id:number){
    const {totalCuenta} = await this.cuentaPorCobrarRepository.createQueryBuilder('cuentas_por_cobrar')
      .leftJoinAndSelect('cuentas_por_cobrar.cuentaPorCobrarDetalle', 'cuentaPorCobrarDetalle')
      .select('SUM(cuentaPorCobrarDetalle.monto)', 'totalCuenta')
      .where('cuentas_por_cobrar.cliente.id = :id', {id})
      .andWhere('cuentas_por_cobrar.estado = FALSE')
      .getRawOne();    

    const {totalVentaCredito} = await this.cuentaPorCobrarRepository.createQueryBuilder('cuentas_por_cobrar')
      .leftJoinAndSelect('cuentas_por_cobrar.venta', 'venta')
      .leftJoinAndSelect('venta.detalle', 'detalle')
      .select('SUM(detalle.cantidad * detalle.precio_venta)', 'totalVentaCredito')
      .where('cuentas_por_cobrar.cliente.id = :id', {id})
      .andWhere('cuentas_por_cobrar.estado = FALSE')
      .getRawOne();
      return {totalCuenta, totalVentaCredito}
    }
}