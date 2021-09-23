import { Injectable } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { getConnection } from 'typeorm';
import { DataService } from '../../common/service/common.service';
import { Venta } from './entity/venta.entity';
import { InventarioService } from '../../almacen/producto/inventario.service';


@Injectable()
export class VentaService extends DataService(Venta){
    constructor(private readonly invertarioService:InventarioService){super()}

    async CreateOne(dto:CreateVentaDto){
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
        return await this.repository.find({
            where:[{id}],
            relations:[
                "detalle_venta",
                "detalle_venta.producto"
            ]
        })
    }

    async FindMany_Venta(){
        return await this.repository.find({
            relations:[
                "detalle_venta",
                "detalle_venta.producto"
            ]
        })
    }

}
