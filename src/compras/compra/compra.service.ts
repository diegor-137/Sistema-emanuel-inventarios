import { Injectable } from '@nestjs/common';
import { DataService } from '../../common/service/common.service';
import { Compra } from './entity/compra.entity';
import { CreateCompraDto } from './dto/create-compra.dto';
import { getConnection,getRepository } from 'typeorm';
import { InventarioService } from '../../almacen/producto/inventario.service';
import { PrecioService } from '../../almacen/producto/precio.service';


@Injectable()
export class CompraService extends DataService(Compra) {
    constructor(private readonly inventarioService: InventarioService) {super()}


    async createOne(dto:CreateCompraDto){
        const connection = getConnection()
        const queryRunner = connection.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const compra = this.repository.create(dto)
            const saved =  await queryRunner.manager.save(compra)
            await this.inventarioService.Ingreso(saved)
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

    async FindOne_Compra(id:number){
        return await this.repository.findOne({
            where:[{id}],
            relations:[
                "empleado",
                "proveedor",
                "sucursal",
                "detalle_compra",
                "detalle_compra.producto"
            ]
        })
    }

    async FindMany_Compra(){
        return await getRepository(Compra)
        .createQueryBuilder("compra")
        .leftJoinAndSelect("compra.empleado","empleado")
        .leftJoinAndSelect("compra.proveedor","proveedor")
        .leftJoinAndSelect("compra.sucursal","sucursal")
        .leftJoinAndSelect("compra.detalle_compra","detalle_compra")
        .select(["compra.id as id","compra.documento as documento",
        "proveedor.nombre as proveedor","sucursal.nombre as sucursal",
        "compra.created_At","SUM(detalle_compra.cantidad*detalle_compra.precio)as total"])
        //.select(["empleado.nombre","proveedor.nombre","sucursal.nombre",
        //"detalle_compra"])
        .groupBy("compra.id,compra.documento,proveedor.nombre,sucursal.nombre")
        .getRawMany()
    }

}
