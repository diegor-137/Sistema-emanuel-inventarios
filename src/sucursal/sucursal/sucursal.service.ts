import { Injectable } from '@nestjs/common';
import { Inventario } from 'src/almacen/producto/entities/inventario.entity';
import { Producto } from 'src/almacen/producto/entities/producto.entity';
import { getRepository } from 'typeorm';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { DataService } from '../../common/service/common.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { EditSucursalDto } from './dto/edit-sucursal.dto';
import { Sucursal } from './entity/sucursal.entity';

@Injectable()
export class SucursalService extends DataService(Sucursal){

    async findAllSucursal(){
        return await this.repository.find({
            relations:["region"]
        })        
    }
 
    @Transactional()
    async CreateOne(sucursal : CreateSucursalDto){
        return this.repository.save(sucursal);
    }

    async editOne(id:number ,sucursal : EditSucursalDto){
        const suc = await this.repository.findOne(id)
        const editSuc = Object.assign(suc, sucursal)
        return await this.repository.save(editSuc)
    }

    @Transactional({propagation:Propagation.MANDATORY})
    async afterCreateNewSuc(sucursal:CreateSucursalDto){
        const productoRep = getRepository(Producto)
        const producto = await productoRep.find()
        const inventarioRep = getRepository(Inventario)
        
        for (let i = 0; i < producto.length; i++) {
            await inventarioRep
            .createQueryBuilder()
            .insert()
            .values([
                {cantidad:0,producto:producto[0],sucursal}
            ])
            .execute()
        }
        return
    }


}