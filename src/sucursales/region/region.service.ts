import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRegionDto } from './dto/create-region.dto';
import { EditRegionDto } from './dto/edit-region.dto';
import { Region } from './entity/region.entity';

@Injectable()
export class RegionService {
    constructor(
        @InjectRepository(Region)
        public readonly repository:Repository<Region>
    ){}

    async findAll(){
        return await this.repository.find({
        })
    }
    
    async findById(id:number){
        const data = await this.repository.findOne(id);
        if(!data) throw new NotFoundException(`El registro no fue encontrado`);
        return data;
    }

    async createOne(dto: CreateRegionDto) {
        const data = this.repository.create(dto);
        return await this.repository.save(data);
      }

    async editOne(id:number, dto:EditRegionDto){
        const data = await this.findById(id)
        const Edited = Object.assign(data,dto)
        return await this.repository.save(Edited)
    }

    async deleteById(id:number){
        const data = await this.findById(id)
        data.estado = false
        return await this.repository.save(data)
    }
}
