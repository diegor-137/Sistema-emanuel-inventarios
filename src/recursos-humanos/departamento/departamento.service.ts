import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataService } from '../../common/service/common.service';
import { CreateDepartamentoDto, EditDepartamentoDto } from './dto';
import { Departamento } from './entity/departamento.entity';

@Injectable()
export class DepartamentoService{

    constructor(
        @InjectRepository(Departamento)
        public readonly repository:Repository<Departamento>

    ){}

    async findAll(){
        return await this.repository.find({
            where:[{
                estado:true
            }]
        })
    }
    
    async findById(id:number){
        const data = await this.repository.findOne(id);
        if(!data) throw new NotFoundException(`El registro no fue encontrado`);
        return data;
    }

    async createOne(dto: CreateDepartamentoDto) {
        const departamento = this.repository.create(dto);
        return await this.repository.save(departamento);
      }

    async editOne(id:number, dto:EditDepartamentoDto){
        const departamento = await this.findById(id)
        const Edited = Object.assign(departamento,dto)
        return await this.repository.save(Edited)
    }

    async deleteById(id:number){
        const data = await this.findById(id)
        data.estado = false
        return await this.repository.save(data)
    }
}
