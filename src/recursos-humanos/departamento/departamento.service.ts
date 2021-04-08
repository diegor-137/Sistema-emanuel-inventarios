import { Injectable, NotFoundException } from '@nestjs/common';
import { DataService } from '../../common/service/common.service';
import { CreateDepartamentoDto, EditDepartamentoDto } from './dto';
import { Departamento } from './entity/departamento.entity';

@Injectable()
export class DepartamentoService extends DataService(Departamento){

    async createOne(dto: CreateDepartamentoDto) {
        const departamento = this.repository.create(dto);
        return await this.repository.save(departamento);
      }

    async editOne(id:number, dto:EditDepartamentoDto){
        const departamento = await this.findById(id)
        const Edited = Object.assign(departamento,dto)
        return await this.repository.save(Edited)
    }
}
