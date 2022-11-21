import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataService } from 'src/common/service/common.service';

import {getRepository, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CreateCompraDto } from '../dto/create-compra.dto';
import { Compra } from '../entity/compra.entity';
import { ExistenciaCompraService } from './existencia-compra.service';



@Injectable()
export class CompraService{
    constructor(
        @InjectRepository(Compra)
        public readonly repository:Repository<Compra>,
        private readonly existencia: ExistenciaCompraService) {}

    async findAll(start: Date, end:Date){
        const st = new Date(start)
        const en = new Date(end)
        const es = true
        return await getRepository(Compra)
        .createQueryBuilder("compra")
        .leftJoinAndSelect("compra.empleado","empleado")
        .leftJoinAndSelect("compra.proveedor","proveedor")
        .leftJoinAndSelect("compra.sucursal","sucursal")
        .leftJoinAndSelect("compra.detalle","detalle")
        .select(["compra.id as id","compra.documento as documento",
        "proveedor.nombre as proveedor","sucursal.nombre as sucursal",
        "compra.created_At","SUM(detalle.cantidad*detalle.precio)as total"])
        .andWhere("compra.created_at>=:st",{st})
        .andWhere("compra.created_at<:en",{en})
        .andWhere("compra.estado",{es})
        .groupBy("compra.id,compra.documento,proveedor.nombre,sucursal.nombre")
        .getRawMany()
    }

    async findById(id:number){
        return await this.repository.findOne({
            where:[{id}],
            relations:[
                "empleado",
                "proveedor",
                "sucursal",
                "detalle",
                "detalle.producto"
            ]
        })
    }

    @Transactional()
    async createOne(dto:CreateCompraDto){
        const compra = this.repository.create(dto)
        const compraRealizada = await this.repository.save(compra)
        await this.existencia.ingresoCompra(compraRealizada)
        return compraRealizada
    }

    @Transactional()
    async editOne(id:number , dto:CreateCompraDto){
        const compra = await this.repository.findOne(id);
        const editCompra = Object.assign(compra, dto);
        await this.existencia.anulacionCompra(editCompra)
        return await this.repository.save(editCompra);
    }

    @Transactional()
    async deleteById(id:number){
        const data = await this.findById(id)
        data.estado = false
        await this.existencia.anulacionCompra(data)
        return await this.repository.save(data)
    }
}

