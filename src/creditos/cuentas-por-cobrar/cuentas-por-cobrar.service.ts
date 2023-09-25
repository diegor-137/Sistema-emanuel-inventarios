import { Injectable, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateCuentasPorCobrarDto } from './dto/create-cuentas-por-cobrar.dto';
import { CuentaPorCobrarDetalle } from './entities/cuenta-por-cobrar-details.entity';
import { CuentaPorCobrar } from './entities/cuenta-por-cobrar.entity';
import { Venta } from '../../ventas/venta/entity/venta.entity';
import { MovimientoCajaService } from 'src/finanzas/movimiento-caja/movimiento-caja.service';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { Caja } from 'src/finanzas/caja/entities/caja.entity';
import { CorteCaja } from 'src/finanzas/corte-caja/entities/corte-caja.entity';
import { Empleado } from '../../recursos-humanos/empleado/entity/empleado.entity';
import { CreditoClienteService } from '../credito-cliente/credito-cliente.service';
import { Sucursal } from 'src/sucursal/sucursal/entity/sucursal.entity';
import { CreateDetalleCuentaBancariaDto } from 'src/finanzas/fondos/cuenta-bancaria/dto/create-detalle-cuenta-bancaria.dto';
import { CuentaBancaria } from 'src/finanzas/fondos/cuenta-bancaria/entities/cuenta-bancaria';
import { User } from 'src/user/entities/user.entity';
import { CuentaBancariaService } from 'src/finanzas/fondos/cuenta-bancaria/cuenta-bancaria.service';


@Injectable()
export class CuentasPorCobrarService {
  constructor(
    @InjectRepository(CuentaPorCobrar)
    private readonly cuentaPorCobrarRepository:Repository<CuentaPorCobrar>,
    @InjectRepository(CuentaPorCobrarDetalle)
    private readonly cuentaPorCobrarDetalleRepository:Repository<CuentaPorCobrarDetalle>,
    private readonly movimientoCajaService: MovimientoCajaService,
    @Inject(forwardRef(() => CreditoClienteService))
    private readonly creditoClienteService:CreditoClienteService,
    @Inject(forwardRef(() => CuentaBancariaService))
    private readonly CuentaBancariaService:CuentaBancariaService
 
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
      cuentaPorCobrarDetalle: [{descripcion: 'CREDITO',monto: 0,balance: balance, tipoTransaccion:null}],
      sucursal: venta.sucursal
    }        
    return await this.cuentaPorCobrarRepository.save(cuentaPorCobrar);      
  }

  async getCuentasPorCobrarParams(sucursal:Sucursal, checked:boolean, dates:Date[], id?:number){
    const st = new Date(dates[0])
    const en = new Date(dates[1])
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
                      .where("cuentas_por_cobrar_det.cuentaPorCobrar.id = cuentas_por_cobrar.id")
        }, "pagos")                                          
        //.where("cliente.id = :id", {id})
        .where(id? "cliente.id = :id": 'TRUE', {id})
        .andWhere("cuentas_por_cobrar.sucursal.id = :idSucursal", {idSucursal: sucursal.id})
        .andWhere("cuentas_por_cobrar.estado = :checked", {checked})
        .andWhere(checked? "cuentas_por_cobrar.fechaInicio >= :st": 'TRUE',  {st})            
        .andWhere(checked? "cuentas_por_cobrar.fechaInicio < :en": 'TRUE',  {en})            
        .groupBy('cuentas_por_cobrar.id, cliente.id, venta.id')
        .getRawMany();  
    data.forEach(r=>r.saldo = r.total-r.pagos)                
    return data   
  }

  @Transactional({propagation: Propagation.REQUIRED})
  async pago(cuentaPorCobrar:CreateCuentasPorCobrarDto, user:User, caja:Caja){
    const lastCuentaPorCobrarDet =  await this.lastCuentaPorCobrarDet(cuentaPorCobrar.id);
    let balance = Number(lastCuentaPorCobrarDet.balance);
   await cuentaPorCobrar.detalleCuentaPorCobrar.reduce(async(b:any, a)=>{
      await b + a.monto;
      balance=balance-a.monto, 
      a.caja=caja, 
      a.cuentaPorCobrar=cuentaPorCobrar, 
      a.balance = balance
      if(a.tipoTransaccion.id !==1){
        a.descripcion = `Doc. no ${a.documento} cuenta No. ${a.cuentaBancaria.numero} ${a.cuentaBancaria.banco.nombre}`
      } 
    }, 0)
    const total = cuentaPorCobrar.detalleCuentaPorCobrar.reduce((a:number, b)=>a+b.monto, 0);
    await this.movimientoCajaService.create(total, `INGRESO POR CREDITO NO. ${cuentaPorCobrar.id}`, 1, caja, true);         
    await this.cuentaPorCobrarDetalleRepository.save(cuentaPorCobrar.detalleCuentaPorCobrar);
    const cuenta = await this.cuentaPorCobrarRepository.findOne(cuentaPorCobrar.id);
    cuenta.estado=true
    cuenta.fechaFinal=new Date();
    cuenta.comentario=cuenta.comentario
    return await this.cuentaPorCobrarRepository.save(cuenta);

  }

  async lastCuentaPorCobrarDet(id:number){
    return  await this.cuentaPorCobrarDetalleRepository.createQueryBuilder('cuentas_por_cobrar_detalle')
    .select()
    .where("cuentas_por_cobrar_detalle.cuentaPorCobrar.id = :id", {id})
    .orderBy('cuentas_por_cobrar_detalle.id', 'DESC')
    .getOne();
  }

  async pagosDetail(id:number){
    return await this.cuentaPorCobrarDetalleRepository.find({
      relations:["tipoTransaccion"],
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
      relations: ['tipoTransaccion'],
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

  @Transactional({propagation: Propagation.REQUIRED})
  async createMovimientoBanco(doc:string, cantidad:number, cuentaPorCobrar:CuentaPorCobrar, cuenta:CuentaBancaria, user:User){
    const detalle:CreateDetalleCuentaBancariaDto={
      documento: doc,
      descripcion: `INGRESO POR COBRO DE CREDITO NO. ${cuentaPorCobrar.id}`,
      monto: cantidad,
      type: true,
    }
  return await this.CuentaBancariaService.transaccion(detalle, user, cuenta.id)
  }

  async totalCuentasPorCobrarEfectivo(id:number){
    return await this.cuentaPorCobrarDetalleRepository.createQueryBuilder("cuentas_por_cobrar_detalle")                                
    .leftJoinAndSelect("cuentas_por_cobrar_detalle.caja", "caja")
    .leftJoinAndSelect("cuentas_por_cobrar_detalle.corteCaja", "corte")
    .select('SUM(cuentas_por_cobrar_detalle.monto)', 'cuentaPorCobrarEfectivo')
    .where('caja.id = :id', {id})
    .andWhere('corte.id is null')
    .andWhere('cuentas_por_cobrar_detalle.tipoTransaccion.id = 1')
    .getRawOne()
  }

  async totalCuentasPorCobrarBanco(id:number){
    return await this.cuentaPorCobrarDetalleRepository.createQueryBuilder("cuentas_por_cobrar_detalle")                                
    .leftJoinAndSelect("cuentas_por_cobrar_detalle.caja", "caja")
    .leftJoinAndSelect("cuentas_por_cobrar_detalle.corteCaja", "corte")
    .select('SUM(cuentas_por_cobrar_detalle.monto)', 'cuentaPorCobrarBanco')
    .where('caja.id = :id', {id})
    .andWhere('corte.id is null')
    .andWhere('cuentas_por_cobrar_detalle.tipoTransaccion.id != 1')
    .getRawOne()
  }
}










  /* async lastCuentaPorCobrarDet(id:number){
    return  await this.cuentaPorCobrarDetalleRepository.createQueryBuilder('cuentas_por_cobrar_detalle')
    .select()
    .where((qb)=>{
      const subQuery= qb.subQuery()
              .select("MAX(detalle.fecha)", "fecha")
              .from(CuentaPorCobrarDetalle, "detalle")
              .where("detalle.cuentaPorCobrar.id = :id", {id})
              .getQuery()
              return "cuentas_por_cobrar_detalle.fecha = " + subQuery
    })
    .getOne();
  } */