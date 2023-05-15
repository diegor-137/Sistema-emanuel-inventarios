import { BadRequestException, Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from '../../compras/proveedor/entity/proveedor.entity';
import { Compra } from '../../compras/compra/entity/compra.entity';
import { CuentaPorPagar } from './entities/cuenta-por-pagar-entity';
import { CuentaPorPagarDetalle } from './entities/cuenta-por-pagar-details.entity';
import { CreateCuentaPorPagarDto } from './dto/create-cuenta-por-pagar.dto';
import { Sucursal } from '../../sucursal/entity/sucursal.entity';
import { Empleado } from 'src/recursos-humanos/empleado/entity/empleado.entity';
import { CreditoProveedorService } from '../credito-proveedor/credito-proveedor.service';

@Injectable()
export class CuentaPorPagarService {

  constructor(
    @InjectRepository(CuentaPorPagar)
    private readonly cuentaPorPagarRepository:Repository<CuentaPorPagar>,
    @InjectRepository(CuentaPorPagarDetalle)
    private readonly cuentaPorPagarDetalleRepository:Repository<CuentaPorPagarDetalle>,
    @Inject(forwardRef(() => CreditoProveedorService))
    private readonly creditoProveedorService:CreditoProveedorService
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

  async getCuentasPorPagarByProveedor(id:number, sucursal:Sucursal, checked:boolean, start?: Date, end?:Date){
    const st = new Date(start)
    const en = new Date(end)
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
        .where("proveedor.id = :id", {id})
        .andWhere("cuentas_por_pagar.sucursal.id = :idSucursal", {idSucursal: sucursal.id})
        .andWhere("cuentas_por_pagar.estado = :checked", {checked})
        .andWhere(checked? "cuentas_por_pagar.fechaInicio >= :st": 'TRUE',  {st})            
        .andWhere(checked? "cuentas_por_pagar.fechaInicio < :en": 'TRUE',  {en})             
        .groupBy('cuentas_por_pagar.id, proveedor.id, compra.documento')
        .getRawMany();  
        data.forEach(r=>r.saldo = r.total-r.pagos)            
        return data
  }

  async getTodosCuentasPorPagar(sucursal?:Sucursal){
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
        .where("cuentas_por_pagar.sucursal.id = :idSucursal", {idSucursal: sucursal.id})                                          
        .andWhere("cuentas_por_pagar.estado = FALSE")             
        .groupBy('cuentas_por_pagar.id, proveedor.id, compra.documento')
        .getRawMany();  
        data.forEach(r=>r.saldo = r.total-r.pagos)            
        return data
  }

  async pagarCreditos(cuentaPorPagarDetalleDto:CreateCuentaPorPagarDto[]){
    let array:any[] = []
    cuentaPorPagarDetalleDto.forEach(r=>{
      array.push({ id:r.cuentaPorPagar.id, estado:r.estado})
    })
    await this.cuentaPorPagarRepository.save(array);
    return await this.cuentaPorPagarDetalleRepository.save(cuentaPorPagarDetalleDto);
  }

  async pagarCredito(cuentaPorPagarDetalleDto:CreateCuentaPorPagarDto){
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
      if( cuentaPorPagarDetalleDto.monto >= cuentaPorPagar.balance) throw new BadRequestException('El monto debe ser diferente') 
      cuentaPorPagarDetalleDto.balance =  saldo; 
      return await this.cuentaPorPagarDetalleRepository.save(cuentaPorPagarDetalleDto);         
  }

  async pagosDetail(id:number){
      return await this.cuentaPorPagarDetalleRepository.find({
        where: {cuentaPorPagar: {id}},
        order: {fecha: 'ASC'}
      })
  }

   /* FUNCIONES USADAS FUERA DE SU MODULO*/

  async totalCuentasPorPagarProveedor(id:number){
    const {totalCuenta} = await this.cuentaPorPagarRepository.createQueryBuilder('cuentas_por_pagar')
      .leftJoinAndSelect('cuentas_por_pagar.cuentaPorPagarDetalle', 'cuentaPorPagarDetalle')
      .select('SUM(cuentaPorPagarDetalle.monto)', 'totalCuenta')
      .where('cuentas_por_pagar.proveedor.id = :id', {id})
      .andWhere('cuentas_por_pagar.estado = FALSE')
      .getRawOne();    

    const {totalCompraCredito} = await this.cuentaPorPagarRepository.createQueryBuilder('cuentas_por_pagar')
      .leftJoinAndSelect('cuentas_por_pagar.compra', 'compra')
      .leftJoinAndSelect('compra.detalle', 'detalle')
      .select('SUM(detalle.cantidad * detalle.precio)', 'totalCompraCredito')
      .where('cuentas_por_pagar.proveedor.id = :id', {id})
      .andWhere('cuentas_por_pagar.estado = FALSE')
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