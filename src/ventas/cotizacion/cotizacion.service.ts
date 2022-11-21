import { Injectable } from '@nestjs/common';
import { DataService } from '../../common/service/common.service';
import { Cotizacion } from './entity/cotizacion.entity';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { getConnection, getRepository, Repository } from 'typeorm';
import { EditCotizacionDto } from './dto/edit-cotizacion.dto';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CotizacionService{
    constructor(
        @InjectRepository(Cotizacion)
        public readonly repository:Repository<Cotizacion>
    ){}
    
    async findAll(start: Date, end:Date){
        const st = new Date(start)
        const en = new Date(end)
        const es = true 
        return await getRepository(Cotizacion)
        .createQueryBuilder("cotizacion")
        .leftJoinAndSelect("cotizacion.empleado","empleado")
        .leftJoinAndSelect("cotizacion.cliente","cliente")
        .leftJoinAndSelect("cotizacion.sucursal","sucursal")
        .leftJoinAndSelect("cotizacion.detalle","detalle")
        .select(["cotizacion.id as id",
        "cliente.nombre as cliente","sucursal.nombre as sucursal",
        "cotizacion.created_At","SUM(detalle.cantidad*detalle.precio_venta)as total"])
        .andWhere("cotizacion.created_at>=:st",{st})
        .andWhere("cotizacion.created_at<:en",{en})
        .andWhere("cotizacion.estado",{es})
        .groupBy("cotizacion.id,cliente.nombre,sucursal.nombre")
        .getRawMany()}
        
    async findById(id:number){
        return await this.repository.findOne({
            where:[{id}],
            relations:[
                "empleado",
                "cliente",
                "sucursal",
                "detalle",
                "detalle.producto"
            ]
        })}

    @Transactional()
    async createOne(dto:CreateCotizacionDto){
        const cotizacion = this.repository.create(dto)
        return await this.repository.save(cotizacion)
    }

    @Transactional()
    async editOne(id:number, dto:EditCotizacionDto){
            const data = await this.findById(id)
            const Edited = Object.assign(data,dto)
            const saved = await this.repository.save(Edited)
            return saved
    }

    async deleteById(id:number){
        const data = await this.findById(id)
        data.estado = false
        return await this.repository.save(data)
    }
}