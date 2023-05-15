import { Injectable, NotFoundException } from '@nestjs/common';
import { DataService } from '../../common/service/common.service';
import { TipoPrecio } from './entities/tipo-precio.entity';
import { TipoPrecioDto } from './dto/tipo-precio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TipoPrecioService{

      constructor(
            @InjectRepository(TipoPrecio)
            public readonly repository:Repository<TipoPrecio>
      ){}

      async findAll(){
            return await this.repository.find({
            })
      }

      async findAllTrue(){
            return await this.repository.find({
            where:[{
                  estado:true
            }]
            })
      }

      async findById(id:number){
            const data = await this.repository.findOne(id)
            if(!data) throw new NotFoundException(`El registro no fue encontrado`);
            return data;
      }

    async createOne(tipo: TipoPrecioDto) {
        return await this.repository.save(tipo);
  }

  async update(id: number, tipo: TipoPrecioDto) {
        const type = await this.repository.findOne(id);
        const editTipo = Object.assign(type, tipo);
        return await this.repository.save(editTipo);
  }

  async delete(id:number){
      const data = await this.findById(id)
      data.estado = false
      return await this.repository.save(data)
  }

}
