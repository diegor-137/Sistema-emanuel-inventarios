import { Injectable } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { getConnection, getRepository } from 'typeorm';
import { DataService } from '../../common/service/common.service';
import { Venta } from './entity/venta.entity';
import { InventarioService } from '../../almacen/producto/inventario.service';


@Injectable()
export class VentaService extends DataService(Venta){
    constructor(private readonly invertarioService:InventarioService){super()}

    async CreateOne(dto:CreateVentaDto){
        //return console.log('object :>> ', dto);
        const connection = getConnection()
        const queryRunner = connection.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const venta = this.repository.create(dto)
            const saved =  await queryRunner.manager.save(venta)
            await this.invertarioService.Egreso(saved)
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

    async FindOne_Venta(id:number){
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

    async FindMany_Venta(){
        return await getRepository(Venta)
        .createQueryBuilder("venta")
        .leftJoinAndSelect("venta.empleado","empleado")
        .leftJoinAndSelect("venta.cliente","cliente")
        .leftJoinAndSelect("venta.sucursal","sucursal")
        .leftJoinAndSelect("venta.detalle","detalle")
        .select(["venta.id as id",
        "cliente.nombre as cliente","sucursal.nombre as sucursal",
        "venta.created_At","SUM(detalle.cantidad*detalle.precio_venta)as total"])
        //.select(["empleado.nombre","proveedor.nombre","sucursal.nombre",
        //"detalle"])
        .groupBy("venta.id,cliente.nombre,venta.created_At,sucursal.nombre")
        .getRawMany()
    }

}
