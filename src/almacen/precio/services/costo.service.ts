import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCostoDto } from '../dto/create-costo.dto';
import { Costo } from '../entities/costo.entity';

@Injectable()
export class CostoService {
    
        constructor(
        @InjectRepository(Costo)
        public readonly repository:Repository<Costo>
        ){}

        async createOne(dto: CreateCostoDto) {
            const data = this.repository.create(dto);
            return await this.repository.save(data);
          }
}
