import { Injectable, NotFoundException } from '@nestjs/common';
import { DataService } from '../../common/service/common.service';
import { Puesto } from './entity/puesto.entity';
import { CreatePuestoDto } from './dto/create-puesto.dto';
import { EditPuestoDto } from './dto/edit-puesto.dto';
import { Departamento } from '../departamento/entity/departamento.entity';
import { getRepository, getConnection, ILike } from 'typeorm';

@Injectable()
export class PuestoService extends DataService(Puesto){

    async createOne(dto: CreatePuestoDto) {
        const puesto = this.repository.create(dto);
        return await this.repository.save(puesto)
    }

    async editOne(id:number, dto:EditPuestoDto){
        const puesto = await this.findById(id)
        const Edited = Object.assign(puesto,dto)
        return await this.repository.save(Edited)
    }

    async findMany_Puesto(){
        return await this.repository.find({relations:["departamento"]})
    }
   
    async findOne_Puesto(id:number){
        return await this.repository.find({
            where:[{id:id}],
            relations:["departamento"]
        })
    }
}
