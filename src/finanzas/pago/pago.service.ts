import { Injectable } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateDetalleEfectivoDto } from '../fondos/efectivo/dto/create-detalle-efectivo.dto';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { CreateDetalleCuentaBancariaDto } from '../fondos/cuenta-bancaria/dto/create-detalle-cuenta-bancaria.dto';
import { CuentaBancaria } from '../fondos/cuenta-bancaria/entities/cuenta-bancaria';
import { CuentaBancariaService } from '../fondos/cuenta-bancaria/cuenta-bancaria.service';
import { EfectivoService } from '../fondos/efectivo/efectivo.service';
import { Compra } from 'src/compras/compra/entity/compra.entity';

@Injectable()
export class PagoService {

  constructor(
    @InjectRepository(Pago)
    public readonly pagoRepository: Repository<Pago>,
    private readonly CuentaBancariaService:CuentaBancariaService,
    private readonly efectivoService:EfectivoService
  ) { }

  @Transactional()
  async create(createPagoDto: CreatePagoDto, user:User, descripcion:string) {
      await createPagoDto.detallePago.reduce(async(b:any, a)=>{
        await b;
        if(a.tipoTransaccion.id == 1){
          await this.createMovimientoEfectivo('', a.monto, createPagoDto.compra, user, createPagoDto.efectivo, descripcion);         
        }else{
        a.descripcion = `Doc. no ${a.documento} cuenta No. ${a.cuentaBancaria.numero} ${a.cuentaBancaria.banco.nombre}`
          await this.createMovimientoBanco(a.documento, a.monto, createPagoDto.compra, a.cuentaBancaria, user, descripcion)
        }
      }, 0.00);
      return await this.pagoRepository.save(createPagoDto);
  }

  async findAll(start: Date, end:Date, idSucursal:number) {
    const st = new Date(start)
    const en = new Date(end)
    en.setDate(en.getDate() + 1);
    return await this.pagoRepository.createQueryBuilder("pago")            
            .leftJoin("pago.empleado", "empleado")
            .leftJoin("pago.compra", "compra")
            .leftJoin("compra.sucursal", "sucursal")
            .leftJoin("compra.proveedor", "proveedor")
            .leftJoin("pago.detallePago", "detallePago")
            .leftJoin("detallePago.tipoTransaccion", "tipoTransaccion")
            .select(["pago.id as id", "pago.fecha as fecha", "empleado.nombre as nombre", "empleado.apellido as apellido", 
            "compra.documento as documento","proveedor.nombre as proveedor","SUM(detallePago.monto) as total"])
            .where("sucursal.id = :idSucursal", {idSucursal})
            .andWhere("pago.fecha >= :st", {st})
            .andWhere("pago.fecha < :en", {en})
            .andWhere("pago.deletedAt IS NULL")
            .orderBy("pago.fecha", "ASC")
            .groupBy("pago.id, empleado.nombre, empleado.apellido, compra.documento, proveedor.nombre")
            .getRawMany();      
  }
/* , empleado.id, compra.id, sucursal.id, proveedor.id, tipoTransaccion.id, detallePago.id */
  async findPago(id: number) {
    return await this.pagoRepository.createQueryBuilder("pago")
            .leftJoinAndSelect("pago.empleado", "empleado")      
            .leftJoinAndSelect("pago.compra", "compra")      
            .leftJoinAndSelect("compra.proveedor", "proveedor")      
            .leftJoinAndSelect("pago.detallePago", "detallePago")      
            .leftJoinAndSelect("detallePago.tipoTransaccion", "tipoTransaccion")
            .select(["pago.id", "pago.fecha", "empleado.nombre", "empleado.apellido", "compra.documento", "compra.createdAt",
            "proveedor.id", "proveedor.nombre", "proveedor.direccion",  "proveedor.nit","detallePago", "tipoTransaccion"])
            .where("pago.id = :id", {id})
            .getOne()      
  }

  @Transactional({propagation: Propagation.MANDATORY})
  async createMovimientoBanco(doc:string, monto:number, compra:Compra, cuenta:CuentaBancaria, user:User, descripcion:string){
    const detalle:CreateDetalleCuentaBancariaDto={
      documento: doc,
      descripcion: `${descripcion} ${compra.documento}`,
      monto,
      type: false,
    }
  return await this.CuentaBancariaService.transaccion(detalle, user, cuenta.id)
  }

  @Transactional({propagation: Propagation.MANDATORY})
  async createMovimientoEfectivo(doc:string, cantidad:number, compra:Compra, user:User, id:number, descripcion:string){
    const detalle:CreateDetalleEfectivoDto={
      documento: doc,
      descripcion: `${descripcion} ${compra.documento}`,
      monto: cantidad,
      type: false
    }
  return await this.efectivoService.transaccion(detalle, user, id)
  }

}
