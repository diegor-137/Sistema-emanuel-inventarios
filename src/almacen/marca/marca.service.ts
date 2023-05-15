import { Injectable, NotFoundException } from '@nestjs/common';
import { MarcaDto } from './dto/marca.dto';
import { Marca } from './entities/marca.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class MarcaService{

      constructor(
            @InjectRepository(Marca)
            public readonly repository:Repository<Marca>
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
    
        async createOne(dto: MarcaDto) {
            const marca = this.repository.create(dto);
            return await this.repository.save(marca);
          }
    
        async editOne(id:number, dto:MarcaDto){
            const marca = await this.findById(id)
            const Edited = Object.assign(marca,dto)
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
