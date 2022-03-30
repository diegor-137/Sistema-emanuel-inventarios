import { Injectable } from '@nestjs/common';
import { DataService } from '../../common/service/common.service';
import { Cotizacion } from './entity/cotizacion.entity';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { getConnection, getRepository } from 'typeorm';
import { EditCotizacionDto } from './dto/edit-cotizacion.dto';

@Injectable()
export class CotizacionService extends DataService(Cotizacion) {
    async createOne(dto:CreateCotizacionDto){
        //eturn console.log('object :>> ', dto);
        const connection = getConnection()
        const queryRunner = connection.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const cotizacion = this.repository.create(dto)
            const saved =  await queryRunner.manager.save(cotizacion)
            await queryRunner.commitTransaction()
            await queryRunner.release()
            return saved
        } catch (err) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            return err.detail
        }finally{
            await queryRunner.release()   
        }
    }

    async editOne(id:number, dto:EditCotizacionDto){
        const connection = getConnection()
        const queryRunner = connection.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const data = await this.findById(id)
            const Edited = Object.assign(data,dto)
            const saved = await queryRunner.manager.save(Edited)
            await queryRunner.commitTransaction()
            await queryRunner.release()
            return saved
        } catch (err) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            return err
        }finally{
            await queryRunner.release()   
        }
    }

    async findOne_Cotizacion(id:number){
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

    async findMany_Cotizacion(){
        return await getRepository(Cotizacion)
        .createQueryBuilder("cotizacion")
        .leftJoinAndSelect("cotizacion.empleado","empleado")
        .leftJoinAndSelect("cotizacion.cliente","cliente")
        .leftJoinAndSelect("cotizacion.sucursal","sucursal")
        .leftJoinAndSelect("cotizacion.detalle","detalle")
        .select(["cotizacion.id as id",
        "cliente.nombre as cliente","sucursal.nombre as sucursal",
        "cotizacion.created_At","SUM(detalle.cantidad*detalle.precio_venta)as total"])
        //.select(["empleado.nombre","proveedor.nombre","sucursal.nombre",
        //"detalle"])
        .groupBy("cotizacion.id,cliente.nombre,sucursal.nombre")
        .getRawMany()

    }
}