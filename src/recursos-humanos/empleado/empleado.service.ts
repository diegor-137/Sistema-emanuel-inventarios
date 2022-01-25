import { Injectable } from '@nestjs/common';
import { DataService } from '../../common/service/common.service';
import { Empleado } from './entity/empleado.entity';
import { CreateEmpleadoDto, EditEmpleadoDto } from './dto';
import { ILike } from 'typeorm';

@Injectable()
export class EmpleadoService extends DataService(Empleado){

    async createOne(dto:CreateEmpleadoDto){
        const empleado = this.repository.create(dto)
        return await this.repository.save(empleado)
    }

    async editOne(id:number, dto:EditEmpleadoDto){
        const empleado = await this.findById(id)
        const Edited = Object.assign(empleado,dto)
        return await this.repository.save(Edited)
    }

    async findMany_Empleado(){
        return await this.repository.find({
            relations:["puesto","sucursal"]
        })
    }

    async findOne_Empelado(id:number){
        return await this.repository.find({
            where:[{id:id}],
            relations:["puesto","sucursal"]
        })
    }

}
