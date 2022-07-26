import { Injectable } from '@nestjs/common';
import { DataService } from '../../common/service/common.service';
import { Pedido } from './entity/pedido-entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { getConnection, getRepository } from 'typeorm';
import { EditPedidoDto } from './dto/edit-pedido.dto';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class PedidoService extends DataService(Pedido) {

    @Transactional()
    async createOne(dto:CreatePedidoDto){
            const pedido = this.repository.create(dto)
            return await this.repository.save(pedido)
    }

    async editOne(id:number, dto:EditPedidoDto){
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

    async findOne_Pedido(id:number){
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

    async findMany_Pedido(){
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
        .groupBy("pedido.id,pedido.documento,proveedor.nombre,sucursal.nombre")
        .getRawMany()
    }
}
