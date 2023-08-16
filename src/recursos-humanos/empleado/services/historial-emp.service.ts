import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { historialEmp } from '../entity/historial-emp.entity';
import { Repository } from 'typeorm';
import { CreateHistorialEmpDto } from '../dto/create-historial.dto';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class HistorialEmpService {

    constructor(
        @InjectRepository(historialEmp)
        public readonly repository:Repository<historialEmp>
    ){}

    async findAll(){
        return await this.repository.find()
    }

    async findById(id:number){
        const data = await this.repository.findOne(id)
        if (!data) throw new NotFoundException("El registro no fue encontrado")
        return data
    }

    @Transactional({propagation:Propagation.MANDATORY})
    async createOne(dto:CreateHistorialEmpDto){
        const historial = this.repository.create(dto)
        return await this.repository.save(historial)
    }

    async editOne(id:number, dto:CreateHistorialEmpDto){
        const historial = await this.findById(id)
        const Edited = Object.assign(historial,dto)
        return await this.repository.save(Edited)
    }

    async deleteById(id:number){
    }

    async findByIdEmpleado(id:number){
        const data = await this.repository.findOne({
            where:{empleado:id}
        })
        return data
    }

}
