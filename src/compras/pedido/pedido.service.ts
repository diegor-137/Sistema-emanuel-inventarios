import { Injectable } from '@nestjs/common';
import { DataService } from '../../common/service/common.service';
import { Pedido } from './entity/pedido-entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { getConnection } from 'typeorm';
import { EditPedidoDto } from './dto/edit-pedido.dto';

@Injectable()
export class PedidoService extends DataService(Pedido) {

    async createOne(dto:CreatePedidoDto){
        const connection = getConnection()
        const queryRunner = connection.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const pedido = this.repository.create(dto)
            const saved =  await queryRunner.manager.save(pedido)
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
        return await this.repository.find({
            where:[{id}],
            relations:[
                "detalle_pedido",
                "detalle_pedido.producto"
            ]
        })
    }

    async findMany_Pedido(){
        return await this.repository.find({
            relations:[
                "detalle_pedido",
                "detalle_pedido.producto"
            ]
        })
    }
}
