import { Injectable, NotFoundException } from '@nestjs/common';
import { DataService } from 'src/common/service/common.service';
import { Categoria } from './entity/categoria.entity';
import { CategoriaDto } from './dtos/categoria.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class CategoriaService{
    constructor(
        @InjectRepository(Categoria)
        public readonly repository:Repository<Categoria>
    ){}

    async findAll(){
        return await this.repository.find({
        })
    }

    async findAllActive(){
        return await this.repository.find({
            where:[{estado:true}]
        })
    }
    
    async findById(id:number){
        const data = await this.repository.findOne(id);
        if(!data) throw new NotFoundException(`El registro no fue encontrado`);
        return data;
    }

    async createOne(dto: CategoriaDto) {
        const categoria = this.repository.create(dto);
        return await this.repository.save(categoria);
      }

    async editOne(id:number, dto:CategoriaDto){
        const categoria = await this.findById(id)
        const Edited = Object.assign(categoria,dto)
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
