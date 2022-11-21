import { Injectable, NotFoundException } from '@nestjs/common';
import { DataService } from '../../common/service/common.service';
import { Puesto } from './entity/puesto.entity';
import { CreatePuestoDto } from './dto/create-puesto.dto';
import { EditPuestoDto } from './dto/edit-puesto.dto';
import { Departamento } from '../departamento/entity/departamento.entity';
import { getRepository, getConnection, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PuestoService{
    constructor(
        @InjectRepository(Puesto)
        public readonly repository:Repository<Puesto>
    ){}

    async findAll(){
        return await this.repository.find({
            where:[{estado:true}],
            relations:["departamento"]}) 
    }

    async findById(id:number){
        const data = await this.repository.findOne({
            where:[{id:id}],
            relations:["departamento"]
        })
        if(!data) throw new NotFoundException(`El registro no fue encontrado`);
        return data;
    }

    async createOne(dto: CreatePuestoDto) {
        const puesto = this.repository.create(dto);
        return await this.repository.save(puesto)
    }

    async editOne(id:number, dto:EditPuestoDto){
        const puesto = await this.findById(id)
        const Edited = Object.assign(puesto,dto)
        return await this.repository.save(Edited)
    }

    async deleteById(id:number){
        const data = await this.findById(id)
        data.estado = false
        return await this.repository.save(data)
    }
}
