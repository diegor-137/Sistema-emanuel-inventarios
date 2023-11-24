import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateVentaDto } from '../dto/create-venta.dto';
import {getRepository, Repository } from 'typeorm';
import { Venta } from '../entity/venta.entity';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { ExistenciaVentaService } from './existencia-venta.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { KardexService } from 'src/almacen/kardex/services/kardex.service';
import { CreditoClienteService } from 'src/creditos/credito-cliente/credito-cliente.service';
import { CuentasPorCobrarService } from 'src/creditos/cuentas-por-cobrar/cuentas-por-cobrar.service';
import { CobroService } from 'src/finanzas/cobro/services/cobro.service';

@Injectable()
export class VentaService{
    constructor(
        @InjectRepository(Venta)
        public readonly repository:Repository<Venta>,
        private readonly existencia:ExistenciaVentaService,
        private readonly kardexService:KardexService,
        private readonly creditoClienteService: CreditoClienteService,
        private readonly cuentasPorCobrarService: CuentasPorCobrarService,
        @Inject(forwardRef(() => CobroService))
        private readonly cobroService: CobroService){}

    //es tercer parametro que recibe es para definir si queremos compras activas o anulada
    async FindAll(start: Date, end:Date,user:User,estado:boolean){
        const sucId = user.empleado.sucursal.id
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
        .andWhere("venta.sucursal=:SucursalId",{SucursalId:sucId})
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
    async CreateOne(dto:CreateVentaDto, user:User){
        dto.pago.code? dto.status = 'CREDITO':null;
        const venta = this.repository.create(dto)
        const ventaRealizada = await this.repository.save(venta)
        if(dto.pago.code){
            await this.creditoClienteService.findOneAndAllowCredit(ventaRealizada, dto.empleado)
            await this.cuentasPorCobrarService.create(ventaRealizada, dto.empleado);
            console.log('Se ha guardo el credito!');                
        }
        if(dto.cobroVenta){
            dto.cobroVenta.venta = ventaRealizada;
            await this.cobroService.create(dto.cobroVenta, user);
        }
        await this.existencia.ingresoVenta(ventaRealizada)
        await this.kardexService.create(2,"Salida Venta",ventaRealizada.sucursal,ventaRealizada.id,ventaRealizada.detalle)
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
