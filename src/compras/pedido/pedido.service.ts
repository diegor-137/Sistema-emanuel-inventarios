import { Injectable, NotFoundException } from '@nestjs/common';
import { DataService } from '../../common/service/common.service';
import { Pedido } from './entity/pedido-entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { getConnection, getRepository, Repository } from 'typeorm';
import { EditPedidoDto } from './dto/edit-pedido.dto';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PedidoService{
    constructor(
        @InjectRepository(Pedido)
        public readonly repository:Repository<Pedido>
    ){}

    async findAll(start: Date, end:Date,user:User){
        const sucId = user.empleado.sucursal.id
        const st = new Date(start)
        const en = new Date(end)
        const es = true
        return await getRepository(Pedido)
        .createQueryBuilder("pedido")
        .leftJoinAndSelect("pedido.empleado","empleado")
        .leftJoinAndSelect("pedido.proveedor","proveedor")
        .leftJoinAndSelect("pedido.sucursal","sucursal")
        .leftJoinAndSelect("pedido.detalle","detalle")
        .select(["pedido.id as id","pedido.documento as documento",
        "proveedor.nombre as proveedor","sucursal.nombre as sucursal",
        "pedido.created_At","SUM(detalle.cantidad*detalle.precio)as total"])
        //.select(["empleado.nombre","proveedor.nombre","sucursal.nombre",
        //"detalle"])
        .andWhere("pedido.created_at>=:st",{st})
        .andWhere("pedido.created_at<:en",{en})
        .andWhere("pedido.estado",{es})
        .andWhere("pedido.sucursal=:SucursalId",{SucursalId:sucId})
        .groupBy("pedido.id,pedido.documento,proveedor.nombre,sucursal.nombre")
        .getRawMany()}

    async findById(id:number){
        const data = this.repository.findOne({
            where:[{id}],
            relations:[
                "empleado",
                "proveedor",
                "sucursal",
                "detalle",
                "detalle.producto"
            ]
        })
            if(!data) throw new NotFoundException(`El registro no fue encontrado`);
            return data;
    }

    @Transactional()
    async createOne(dto:CreatePedidoDto){
            const pedido = this.repository.create(dto)
            return await this.repository.save(pedido)
    }

    @Transactional()
    async editOne(id:number, dto:EditPedidoDto){
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
