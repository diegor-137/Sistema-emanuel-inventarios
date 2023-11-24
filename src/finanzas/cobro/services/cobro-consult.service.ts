import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Cobro } from '../entities/cobro.entity';

@Injectable()
export class CobroConsultService {

    constructor(@InjectRepository(Cobro)
    public readonly cobroRepository: Repository<Cobro>){}

    async findAllCobros(id:number){
      return await this.cobroRepository.createQueryBuilder("cobro")            
              .leftJoinAndSelect("cobro.venta", "venta")
              .leftJoinAndSelect("venta.cliente", "cliente")
              .leftJoinAndSelect("cobro.detalleCobro", "detalleCobro")
              .select(["cobro.id as id", "cobro.fecha as fecha", "venta.id as venta", "cliente.nombre as cliente", "SUM(detalleCobro.monto)as total"])
              .where("cobro.caja.id = :id", {id})
              .andWhere("cobro.deletedAt IS NULL")
              .andWhere("cobro.corteCaja.id IS NULL")
              .orderBy("cobro.fecha", "ASC")
              .groupBy("cobro.id, venta.id, cliente.nombre")
              .getRawMany() 
    }

    async findAll(start: Date, end:Date, id:number) {
      const st = new Date(start)
      const en = new Date(end)
      en.setDate(en.getDate() + 1);
      return await this.cobroRepository.createQueryBuilder("cobro")            
              .leftJoinAndSelect("cobro.empleado", "empleado")
              .leftJoinAndSelect("cobro.venta", "venta")
              .leftJoinAndSelect("venta.cliente", "cliente")
              .leftJoinAndSelect("cobro.detalleCobro", "detalleCobro")
              .select(["cobro.id as id", "cobro.fecha as fecha", "empleado.nombre as nombre", "empleado.apellido as apellido", "venta.id as venta", "cliente.nombre as cliente", "SUM(detalleCobro.monto)as total"])
              .where("cobro.caja.id = :id", {id})
              .andWhere("cobro.fecha >= :st", {st})
              .andWhere("cobro.fecha < :en", {en})
              .andWhere("cobro.deletedAt IS NULL")
              .orderBy("cobro.fecha", "ASC")
              .groupBy("cobro.id, empleado.id, venta.id, cliente.nombre")
              .getRawMany();      
    }

    async findAllDeleted(start: Date, end:Date, id:number) {
      const st = new Date(start)
      const en = new Date(end)
      en.setDate(en.getDate() + 1);
      return await this.cobroRepository.createQueryBuilder("cobro")            
              .leftJoinAndSelect("cobro.empleado", "empleado")
              .leftJoinAndSelect("cobro.venta", "venta")
              .leftJoinAndSelect("venta.cliente", "cliente")
              .leftJoinAndSelect("cobro.detalleCobro", "detalleCobro")
              .leftJoinAndSelect("cobro.deleteResponsible", "deleteResponsible")
              .select(["cobro.id as id", "cobro.fecha as fecha", "empleado.nombre as nombre", "empleado.apellido as apellido", "venta.id as venta", "cliente.nombre as cliente", "SUM(detalleCobro.monto)as total", "cobro.deletedAt as deletedAt",
                "deleteResponsible.nombre as nombreresp", "deleteResponsible.apellido as apellidoresp",  
              ])
              .where("cobro.caja.id = :id", {id})
              .andWhere("cobro.fecha >= :st", {st})
              .andWhere("cobro.fecha < :en", {en})
              .andWhere("cobro.deletedAt IS NOT NULL")
              .orderBy("cobro.fecha", "ASC")
              .groupBy("cobro.id, empleado.id, venta.id, cliente.nombre, deleteResponsible.id")
              .getRawMany();      
    }

    async findOne(id: number) {
      return await this.cobroRepository.findOne(id, {relations: ["detalleCobro", "detalleCobro.tipoTransaccion"]});   
    }
  
    async findCobro(id: number) {
      return await this.cobroRepository.createQueryBuilder("cobro")
              .leftJoinAndSelect("cobro.empleado", "empleado")      
              .leftJoinAndSelect("cobro.venta", "venta")      
              .leftJoinAndSelect("venta.cliente", "cliente")      
              .leftJoinAndSelect("cobro.caja", "caja")      
              .leftJoinAndSelect("caja.empleado", "empleadCaja")      
              .leftJoinAndSelect("cobro.detalleCobro", "detalleCobro")      
              .leftJoinAndSelect("detalleCobro.tipoTransaccion", "tipoTransaccion")
              .select(["cobro.id", "cobro.fecha", "empleado.nombre", "empleado.apellido", "venta.id", "venta.createdAt", "cliente.id", "cliente.nombre", "cliente.direccion", 
              "caja.id", "caja.nombre", "empleadCaja.nombre", "empleadCaja.apellido", "detalleCobro", "tipoTransaccion"])
              .where("cobro.id = :id", {id})
              .getOne()      
    }


    /* FUNCION USADO FUERA DEL MODULO (CORTE CAJA)*/

    async ventasCobrosCorte(idCaja:number, idCorte:number){
      return await this.cobroRepository.createQueryBuilder("cobro")                                
      .innerJoinAndSelect("cobro.detalleCobro", "detalle")
      .innerJoinAndSelect("cobro.venta", "venta")
      .innerJoinAndSelect("venta.cliente", "cliente")
      .select(['cobro.id AS id', 'cobro.fecha AS fecha', 'cobro.deletedAt AS deletedAt','SUM(detalle.monto) AS monto', 'venta.id', 'cliente.nombre AS cliente'])
      .where('cobro.corteCaja.id = :idCaja', {idCaja})
      .andWhere('cobro.caja.id = :idCorte', {idCorte})
      .groupBy('cobro.id, venta.id, cliente.id')
      .getRawMany() 
    }

    async totalCobro(id:number){
      return await this.cobroRepository.createQueryBuilder("cobro")                                
      .innerJoinAndSelect("cobro.detalleCobro", "detalle")
      .leftJoinAndSelect("cobro.caja", "caja")
      .leftJoinAndSelect("cobro.corteCaja", "corte")
      .select('SUM(detalle.monto)', 'cobro')
      .where('caja.id = :id', {id})
      .andWhere('corte.id IS NULL')
      .andWhere('cobro.deletedAt IS NULL')
      .getRawOne() 
    }
    /* CONSULTA PARA MANDAR A LLAMAR TODOS LOS COBROS EN EL BANCO */
    async totalCobroEfectivo(id:number){
      return await this.cobroRepository.createQueryBuilder("cobro")                                
      .innerJoinAndSelect("cobro.detalleCobro", "detalle", 
       "detalle.tipoTransaccion.id = 1" 
      )
      .leftJoinAndSelect("cobro.caja", "caja")
      .leftJoinAndSelect("cobro.corteCaja", "corte")
      .select('SUM(detalle.monto)', 'cobroEfectivo')
      .where('caja.id = :id', {id})
      .andWhere('corte.id IS NULL')
      .andWhere('cobro.deletedAt IS NULL')
      .getRawOne() 
    }
  
    async totalCobroBanco(id:number){
      return await this.cobroRepository.createQueryBuilder("cobro")                                
      .innerJoinAndSelect("cobro.detalleCobro", "detalle", 
       "detalle.tipoTransaccion.id != 1" 
      )
      .leftJoinAndSelect("cobro.caja", "caja")
      .leftJoinAndSelect("cobro.corteCaja", "corte")
      .select('SUM(detalle.monto)', 'cobroBanco')
      .where('caja.id = :id', {id})
      .andWhere('corte.id IS NULL')
      .andWhere('cobro.deletedAt IS NULL')
      .getRawOne() 
    }


}
