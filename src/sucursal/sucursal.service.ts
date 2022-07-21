import { Injectable } from '@nestjs/common';
import { DataService } from '../common/service/common.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { EditSucursalDto } from './dto/edit-sucursal.dto';
import { Sucursal } from './entity/sucursal.entity';

@Injectable()
export class SucursalService extends DataService(Sucursal){
 
    async CreateOne(sucursal : CreateSucursalDto){
        return this.repository.save(sucursal);
    }

    async editOne(id:number ,sucursal : EditSucursalDto){
        const suc = await this.repository.findOne(id)
        const editSuc = Object.assign(suc, sucursal)
        return await this.repository.save(editSuc)
    }
}
