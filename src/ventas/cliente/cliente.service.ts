import { Injectable, NotFoundException } from '@nestjs/common';
import { DataService } from 'src/common/service/common.service';
import { Cliente } from './entity/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { EditClienteDto } from './dto/edit-cliente.dto';
import { CreditoClienteService } from 'src/creditos/credito-cliente/credito-cliente.service';
import { Empleado } from '../../recursos-humanos/empleado/entity/empleado.entity';
import { getConnection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class ClienteService{

    constructor(
        @InjectRepository(Cliente)
        public readonly repository:Repository<Cliente>,
        private readonly creditoClienteService:CreditoClienteService
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

    async CreateOne(dto:CreateClienteDto, empleado:Empleado){      
        const credito = dto.credito[0];
        const cliente = await this.repository.save(dto);
        delete cliente.credito;                              
        dto.credit?(
            credito.sucursal = empleado.sucursal,
            credito.cliente = cliente,           
            await this.creditoClienteService.create(credito)
            ):null                  
        return cliente;
    }

    async EditOne(id:number,dto:EditClienteDto, empleado:Empleado){
        const cliente = await this.findById(id)                                      
        dto.credito && dto.credit === false ? (
            dto.credito[0].estado = false,
            dto.credito[0].cliente = cliente,
            dto.credito[0].sucursal = empleado.sucursal,
            await this.creditoClienteService.create(dto.credito[0])            
            ) : null
        dto.credit?(
            dto.credito[0].cliente = cliente,
            dto.credito[0].sucursal = empleado.sucursal,            
            await this.creditoClienteService.create(dto.credito[0])
            ):null
        const Edited = Object.assign(cliente,dto)
        delete Edited.credito
        return await this.repository.save(Edited)
    }

    async findTodos(idSucursal:number){
        const clientes = await this.repository.createQueryBuilder('cliente')
                .leftJoinAndSelect('cliente.credito', 'credito', `credito.sucursal.id = ${idSucursal}`)                                                    
                .getMany()    
        return clientes
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