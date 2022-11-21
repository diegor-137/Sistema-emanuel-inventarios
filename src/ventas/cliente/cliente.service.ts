import { Injectable, NotFoundException } from '@nestjs/common';
import { DataService } from 'src/common/service/common.service';
import { Cliente } from './entity/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { EditClienteDto } from './dto/edit-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class ClienteService{

    constructor(
        @InjectRepository(Cliente)
        public readonly repository:Repository<Cliente>
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

    async CreateOne(dto:CreateClienteDto){
        const cliente = this.repository.create(dto)
        return await this.repository.save(cliente)
    }

    async EditOne(id:number,dto:EditClienteDto){
        const cliente = await this.findById(id)
        const Edited = Object.assign(cliente,dto)
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