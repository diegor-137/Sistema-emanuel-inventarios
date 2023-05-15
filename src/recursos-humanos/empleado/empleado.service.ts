import { Injectable, NotFoundException } from '@nestjs/common';
import { DataService } from '../../common/service/common.service';
import { Empleado } from './entity/empleado.entity';
import { CreateEmpleadoDto, EditEmpleadoDto } from './dto';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmpleadoService{

    constructor(
        @InjectRepository(Empleado)
        public readonly repository:Repository<Empleado>
    ){}

    async findAll(){
        return await this.repository.find({
            where:[{estado:true}],
            relations:["puesto","sucursal"]
        })
    }

    async findById(id:number){
        const data = await this.repository.findOne(id)
        if (!data) throw new NotFoundException("El registro no fue encontrado")
        return data
    }

    async createOne(dto:CreateEmpleadoDto){
        const empleado = this.repository.create(dto)
        return await this.repository.save(empleado)
    }

    async editOne(id:number, dto:EditEmpleadoDto){
        const empleado = await this.findById(id)
        const Edited = Object.assign(empleado,dto)
        return await this.repository.save(Edited)
    }

    async deleteById(id:number){
        const data = await this.findById(id)
        data.estado = false
        return await this.repository.save(data)
    }

}
