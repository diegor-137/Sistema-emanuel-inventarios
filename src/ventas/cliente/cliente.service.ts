import { Injectable } from '@nestjs/common';
import { DataService } from 'src/common/service/common.service';
import { Cliente } from './entity/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { EditClienteDto } from './dto/edit-cliente.dto';

@Injectable()
export class ClienteService extends DataService(Cliente){

    async CreateOne(dto:CreateClienteDto){
        const cliente = this.repository.create(dto)
        return await this.repository.save(cliente)
    }

    async EditOne(id:number,dto:EditClienteDto){
        const cliente = await this.findById(id)
        const Edited = Object.assign(cliente,dto)
        return await this.repository.save(Edited)
    }
}