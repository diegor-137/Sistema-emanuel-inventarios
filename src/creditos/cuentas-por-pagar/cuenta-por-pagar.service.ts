import { BadRequestException, Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from '../../compras/proveedor/entity/proveedor.entity';
import { Compra } from '../../compras/compra/entity/compra.entity';
import { CuentaPorPagar } from './entities/cuenta-por-pagar-entity';
import { CuentaPorPagarDetalle } from './entities/cuenta-por-pagar-details.entity';
import { CreateCuentaPorPagarDto, CreateCuentasPorPagarDetalleDto } from './dto/create-cuenta-por-pagar.dto';
import { Sucursal } from 'src/sucursal/sucursal/entity/sucursal.entity';
import { Empleado } from 'src/recursos-humanos/empleado/entity/empleado.entity';
import { CreditoProveedorService } from '../credito-proveedor/credito-proveedor.service';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { User } from 'src/user/entities/user.entity';
import { CuentaBancariaService } from 'src/finanzas/fondos/cuenta-bancaria/cuenta-bancaria.service';
import { CreateDetalleCuentaBancariaDto } from 'src/finanzas/fondos/cuenta-bancaria/dto/create-detalle-cuenta-bancaria.dto';
import { CuentaBancaria } from 'src/finanzas/fondos/cuenta-bancaria/entities/cuenta-bancaria';
import { CreateDetalleEfectivoDto } from 'src/finanzas/fondos/efectivo/dto/create-detalle-efectivo.dto';
import { EfectivoService } from 'src/finanzas/fondos/efectivo/efectivo.service';

@Injectable()
export class CuentaPorPagarService {

  constructor(
    @InjectRepository(CuentaPorPagar)
    private readonly cuentaPorPagarRepository:Repository<CuentaPorPagar>,
    @InjectRepository(CuentaPorPagarDetalle)
    private readonly cuentaPorPagarDetalleRepository:Repository<CuentaPorPagarDetalle>,
    @Inject(forwardRef(() => CreditoProveedorService))
    private readonly creditoProveedorService:CreditoProveedorService,
    private readonly CuentaBancariaService:CuentaBancariaService,
    private readonly efectivoService:EfectivoService
  ){}

  async create(compra:Compra, empleado:Empleado) {
    const dias = await this.creditoProveedorService.findOne(compra.proveedor, empleado.sucursal)
    const date = new Date();
    date.setDate(date.getDate() + dias.diasCredito);
    const balance = compra.detalle.reduce((sum, a)=> sum +  Number(a.cantidad * a.precio), 0.00);
    const cuentaPorPagar: CuentaPorPagar = {
      fechaFinal: date, 
      proveedor: compra.proveedor, 
      compra,
      cuentaPorPagarDetalle: [{descripcion: 'CREDITO',monto: 0,balance: balance}], 
      sucursal: empleado.sucursal
    }
    return await this.cuentaPorPagarRepository.save(cuentaPorPagar);
   
  }

  /* async findAll(){
    return await this.creditoProveedorRepository.createQueryBuilder('credito_proveedores')
            .innerJoinAndSelect('credito_proveedores.compra', 'compra')
            .innerJoinAndSelect('credito_proveedores.proveedor', 'proveedor')
            .innerJoinAndSelect('compra.detalle', 'detalle')
            .select(['credito_proveedores.id as id', 'credito_proveedores.fechaFinal as fechaFinal', 'credito_proveedores.estado as estado', 
            'compra.documento as documento','SUM(detalle.cantidad*detalle.precio) as total', 'proveedor.nombre as proveedor'])
            .groupBy('credito_proveedores.id, compra.id, proveedor.id')
            .getRawMany();
  } */

  async getCuentasPorPagarParams(sucursal:Sucursal, checked:boolean, dates:Date[], id?:number){
    const st = new Date(dates[0])
    const en = new Date(dates[1])
    en.setDate(en.getDate() + 1);
        const data = await this.cuentaPorPagarRepository.createQueryBuilder('cuentas_por_pagar')
        .innerJoin('cuentas_por_pagar.proveedor', 'proveedor')
        .innerJoin('cuentas_por_pagar.compra', 'compra')
        .innerJoin('compra.detalle', 'detalle')
        .select(['cuentas_por_pagar.id as id', 'cuentas_por_pagar.fechaInicio as fechaInicio', 'cuentas_por_pagar.fechaFinal as fechaFinal', 
        'cuentas_por_pagar.estado as estado', 'compra.documento as documento'
        ,'proveedor.nombre as proveedor', 'SUM(detalle.cantidad*detalle.precio) AS total'])
        .addSelect((sub)=>{
            return sub.select("SUM(cuentas_por_pagar_det.monto)", "pagos")
                      .from(CuentaPorPagarDetalle, "cuentas_por_pagar_det")
                      .where("cuentas_por_pagar_det.cuentaPorPagar = cuentas_por_pagar.id")
        }, "pagos")                                          
        //.where("proveedor.id = :id", {id})
        .where(id? "proveedor.id = :id": "", {id})
        .andWhere("cuentas_por_pagar.sucursal.id = :idSucursal", {idSucursal: sucursal.id})
        .andWhere("cuentas_por_pagar.estado = :checked", {checked})
        .andWhere(checked? "cuentas_por_pagar.fechaInicio >= :st": 'TRUE',  {st})            
        .andWhere(checked? "cuentas_por_pagar.fechaInicio < :en": 'TRUE',  {en})             
        .groupBy('cuentas_por_pagar.id, proveedor.id, compra.documento')
        .getRawMany();  
        data.forEach(r=>r.saldo = r.total-r.pagos)            
        return data
  }

/*   async pagarCreditos(cuentaPorPagarDetalleDto:CreateCuentaPorPagarDto[]){
    let array:any[] = []
    cuentaPorPagarDetalleDto.forEach(r=>{
      array.push({ id:r.cuentaPorPagar.id, estado:r.estado})
    })
    await this.cuentaPorPagarRepository.save(array);
    return await this.cuentaPorPagarDetalleRepository.save(cuentaPorPagarDetalleDto);
  } */

/*   async pagarCredito(cuentaPorPagarDetalleDto:CreateCuentaPorPagarDto){
      const cuentaPorPagar = await this.cuentaPorPagarDetalleRepository.createQueryBuilder('cuentas_por_pagar_detalle')
        .select()
        .where((qb)=>{
          const subQuery= qb.subQuery()
                  .select("MAX(cuentas_por_pagar_det.fecha)", "fecha")
                  .from(CuentaPorPagarDetalle, "cuentas_por_pagar_det")
                  .where("cuentas_por_pagar_det.cuentaPorPagar.id = :id", {id: cuentaPorPagarDetalleDto.cuentaPorPagar.id})
                  .getQuery()
                  return "cuentas_por_pagar_detalle.fecha = " + subQuery
        })
        .getOne();
      const saldo =  Number(cuentaPorPagar.balance) - cuentaPorPagarDetalleDto.monto;
      if( cuentaPorPagarDetalleDto.monto >= cuentaPorPagar.balance) throw new BadRequestException('El monto debe ser parcial') 
      cuentaPorPagarDetalleDto.balance =  saldo; 
      return await this.cuentaPorPagarDetalleRepository.save(cuentaPorPagarDetalleDto);         
  } */

  

  async pago(cuentaPorPagar:CreateCuentaPorPagarDto, user:User){
    const lastCuentaPorPagarDet =  await this.lastCuentaPorPagarDet(cuentaPorPagar.id);
    let balance = Number(lastCuentaPorPagarDet.balance);
    await cuentaPorPagar.detalleCuentaPorPagar.reduce(async(b:any, a)=>{
      await b;
      balance=balance-a.monto, 
      a.cuentaPorPagar=cuentaPorPagar, 
      a.balance = balance
      if(a.tipoTransaccion.id == 1){
        await this.createMovimientoEfectivo('', a.monto, cuentaPorPagar, user, cuentaPorPagar.efectivo);         
      }else{
      a.descripcion = `Doc. no ${a.documento} cuenta No. ${a.cuentaBancaria.numero} ${a.cuentaBancaria.banco.nombre}`
      await this.createMovimientoBanco(a.documento, a.monto, cuentaPorPagar, a.cuentaBancaria, user)
      }
    }, 0)
    await this.cuentaPorPagarDetalleRepository.save(cuentaPorPagar.detalleCuentaPorPagar);
    const cuenta = await this.cuentaPorPagarRepository.findOne(cuentaPorPagar.id);
    cuenta.estado=true
    cuenta.fechaFinal=new Date();
    cuenta.comentario=cuenta.comentario
    return await this.cuentaPorPagarRepository.save(cuenta);

  }

  async createMovimientoBanco(doc:string, cantidad:number, cuentaPorPagar:CuentaPorPagar, cuenta:CuentaBancaria, user:User){
    const detalle:CreateDetalleCuentaBancariaDto={
      documento: doc,
      descripcion: `EGRESO POR CREDITO NO. ${cuentaPorPagar.id}`,
      monto: cantidad,
      type: false,
    }
    return await this.CuentaBancariaService.transaccion(detalle, user, cuenta.id)
  }

  async lastCuentaPorPagarDet(id:number){
    return  await this.cuentaPorPagarDetalleRepository.createQueryBuilder('cuentas_por_pagar_detalle')
    .select()
    .where("cuentas_por_pagar_detalle.cuentaPorPagar.id = :id", {id})
    .orderBy('cuentas_por_pagar_detalle.id', 'DESC')
    .getOne();
  }

  async createMovimientoEfectivo(doc:string, cantidad:number, cuentaPorPagar:CuentaPorPagar, user:User, id:number){
    const detalle:CreateDetalleEfectivoDto={
      documento: doc,
      descripcion: `ENGRESO POR PAGO CREDITO NO. ${cuentaPorPagar.id}`,
      monto: cantidad,
      type: false
    }
  return await this.efectivoService.transaccion(detalle, user, id)
  }

  

  async pagosDetail(id:number){
      return await this.cuentaPorPagarDetalleRepository.find({
        relations:["tipoTransaccion"],  
        where: {cuentaPorPagar: {id}},
        order: {fecha: 'ASC'}
      })
  }

   /* FUNCIONES USADAS FUERA DE SU MODULO*/

  async totalCuentasPorPagarProveedor(id:number, sucursal:Sucursal){
    const {totalCuenta} = await this.cuentaPorPagarRepository.createQueryBuilder('cuentas_por_pagar')
      .leftJoinAndSelect('cuentas_por_pagar.cuentaPorPagarDetalle', 'cuentaPorPagarDetalle')
      .leftJoinAndSelect('cuentas_por_pagar.sucursal', 'sucursal')
      .select('SUM(cuentaPorPagarDetalle.monto)', 'totalCuenta')
      .where('cuentas_por_pagar.proveedor.id = :id', {id})
      .andWhere('cuentas_por_pagar.estado = FALSE')
      .andWhere('sucursal.id =:idSucursal', {idSucursal:sucursal.id})
      .getRawOne();    

    const {totalCompraCredito} = await this.cuentaPorPagarRepository.createQueryBuilder('cuentas_por_pagar')
      .leftJoinAndSelect('cuentas_por_pagar.compra', 'compra')
      .leftJoinAndSelect('compra.detalle', 'detalle')
      .leftJoinAndSelect('cuentas_por_pagar.sucursal', 'sucursal')
      .select('SUM(detalle.cantidad * detalle.precio)', 'totalCompraCredito')
      .where('cuentas_por_pagar.proveedor.id = :id', {id})
      .andWhere('cuentas_por_pagar.estado = FALSE')
      .andWhere('sucursal.id =:idSucursal', {idSucursal:sucursal.id})
      .getRawOne();
      return {totalCuenta, totalCompraCredito}
    }
}

/* 
const result = await userRepo
                     .createQueryBuilder('user')
                     .leftJoinAndSelect(
                         qb => qb
                            .select()
                            .from(UserPhotos, 'p')
                            .orderBy({ 'p.updatedAt': 'ASC' })
                            .limit(5),
                         'photos',
                         'photos.userId = user.id' // the answer
                     )
                     .getRawMany() */