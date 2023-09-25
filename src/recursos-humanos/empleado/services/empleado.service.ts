import { Injectable, NotFoundException } from '@nestjs/common';
import { DataService } from '../../../common/service/common.service';
import { Empleado } from '../entity/empleado.entity';
import { CreateEmpleadoDto, EditEmpleadoDto } from '../dto';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHistorialEmpDto } from '../dto/create-historial.dto';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { HistorialEmpService } from './historial-emp.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class EmpleadoService{

    constructor(
        @InjectRepository(Empleado)
        public readonly repository:Repository<Empleado>,
        private readonly historialEmpService:HistorialEmpService,
    ){}

    async findAll(){
        return await this.repository.find({
            relations:["puesto","sucursal"],
            where:[{
                //email:"superadmin@gmail.com"
            }]
        })
    }
    async findAllPorSucursal(user:User){
        return await this.repository.find({
            where:[{
                estado:true,
                sucursal: {
                    id:user.empleado.sucursal.id
                },
            }]
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

    @Transactional()
    async desacrivar(id:number,dto:CreateHistorialEmpDto){
        const data = await this.findById(id)
        data.estado = false
        await this.historialEmpService.createOne(dto)
        return await this.repository.save(data)
    }

    @Transactional()
    async activar(id:number,dto:CreateHistorialEmpDto){
        const data = await this.findById(id)
        data.estado = true
        await this.historialEmpService.createOne(dto)
        return await this.repository.save(data)
    }

}
