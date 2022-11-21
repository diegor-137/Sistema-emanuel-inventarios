import { Injectable } from '@nestjs/common';
import { CreateVentaDto } from '../dto/create-venta.dto';
import {getRepository, Repository } from 'typeorm';
import { Venta } from '../entity/venta.entity';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ExistenciaVentaService } from './existencia-venta.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VentaService{
    constructor(
        @InjectRepository(Venta)
        public readonly repository:Repository<Venta>,
        private readonly existencia:ExistenciaVentaService){}


    async FindAll(start: Date, end:Date){
        const st = new Date(start)
        const en = new Date(end)
        const es = true
        return await getRepository(Venta)
        .createQueryBuilder("venta")
        .leftJoinAndSelect("venta.empleado","empleado")
        .leftJoinAndSelect("venta.cliente","cliente")
        .leftJoinAndSelect("venta.sucursal","sucursal")
        .leftJoinAndSelect("venta.detalle","detalle")
        .select(["venta.id as id",
        "cliente.nombre as cliente",
        "sucursal.nombre as sucursal",
        "venta.created_At",
        "SUM(detalle.cantidad*detalle.precio_venta)as total"])
        .andWhere("venta.created_at>=:st",{st})
        .andWhere("venta.created_at<:en",{en})
        .andWhere("venta.estado",{es})
        .groupBy("venta.id,cliente.nombre,sucursal.nombre,venta.created_At")
        .getRawMany()
    }

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
        })
    }

    @Transactional()
    async CreateOne(dto:CreateVentaDto){
        const venta = this.repository.create(dto)
        const ventaRealizada = await this.repository.save(venta)
        await this.existencia.ingresoVenta(ventaRealizada)
        return ventaRealizada
    }
    
    @Transactional()
    async editOne(id:number,dto:CreateVentaDto){
        const departamento = await this.findById(id)
        const Edited = Object.assign(departamento,dto)
        await this.existencia.anulacionVenta(Edited)
        return await this.repository.save(Edited)
    }

    @Transactional()
    async deleteById(id:number){
        const data = await this.findById(id)
        data.estado = false
        await this.existencia.anulacionVenta(data)
        return await this.repository.save(data)
    }
}
