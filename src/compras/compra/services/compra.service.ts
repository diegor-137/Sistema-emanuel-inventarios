import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataService } from 'src/common/service/common.service';

import {getRepository, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CreateCompraDto } from '../dto/create-compra.dto';
import { Compra } from '../entity/compra.entity';
import { ExistenciaCompraService } from './existencia-compra.service';
import { CuentaPorPagarService } from 'src/creditos/cuentas-por-pagar/cuenta-por-pagar.service';
import { CreditoProveedorService } from 'src/creditos/credito-proveedor/credito-proveedor.service';
import { User } from 'src/user/entities/user.entity';
import { KardexService } from 'src/almacen/kardex/services/kardex.service';



@Injectable()
export class CompraService{
    constructor(
        @InjectRepository(Compra)
        public readonly repository:Repository<Compra>,
        private readonly existencia: ExistenciaCompraService,
        private readonly cuentaPorPagarService: CuentaPorPagarService,
        private readonly creditoProveedorService: CreditoProveedorService,
        private readonly kardexService:KardexService) {}


    //es tercer parametro que recibe es para definir si queremos compras activas o anuladas
    async findAll(start: Date, end:Date,user:User,estado:boolean){
        const sucId = user.empleado.sucursal.id
        const st = new Date(start)
        const en = new Date(end)
        const es = estado
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
        .andWhere("compra.estado= :est",{est:es})
        .andWhere("compra.sucursal=:SucursalId",{SucursalId:sucId})
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
        //console.log(compraRealizada)
        await this.kardexService.create(1,"ingreso compra",compraRealizada.sucursal,compraRealizada.id,compraRealizada.detalle)
        if(dto.pago.code){
            await this.creditoProveedorService.findOneAndAllowCredit(compraRealizada, dto.empleado)
            await this.cuentaPorPagarService.create(compraRealizada, dto.empleado);
        }

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

