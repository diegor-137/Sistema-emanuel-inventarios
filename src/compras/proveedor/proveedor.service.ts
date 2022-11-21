import { Injectable, NotFoundException } from '@nestjs/common';
import { DataService } from '../../common/service/common.service';
import { Proveedor } from './entity/proveedor.entity';
import { EditProveedorDto } from './dto';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class ProveedorService{

    constructor(
        @InjectRepository(Proveedor)
        public readonly repository:Repository<Proveedor>
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

    async createOne(dto:CreateProveedorDto){
        const data = this.repository.create(dto);
        return await this.repository.save(data)   
    }
    
    async editOne(id:number, dto:EditProveedorDto){
        const data = await this.findById(id)
        const Edited = Object.assign(data,dto)
        return await this.repository.save(Edited)
    }

    async deleteById(id:number){
        const data = await this.findById(id)
        data.estado = false
        return await this.repository.save(data)
    }

    async findByName(nombre:string){
        return await this.repository.find({
           where: {
            nombre: ILike(`%${nombre}%`),
            estado: true
          } 
        });
      }
}
