import { Injectable } from '@nestjs/common';
import { DataService } from '../../common/service/common.service';
import { Proveedor } from './entity/proveedor.entity';
import { EditProveedorDto } from './dto';
import { CreateProveedorDto } from './dto/create-proveedor.dto';

@Injectable()
export class ProveedorService extends DataService(Proveedor){

    async createOne(dto:CreateProveedorDto){
        const data = this.repository.create(dto);
        return await this.repository.save(data)   
    }
    
    async editOne(id:number, dto:EditProveedorDto){
        const data = await this.findById(id)
        const Edited = Object.assign(data,dto)
        return await this.repository.save(Edited)
    }

}
