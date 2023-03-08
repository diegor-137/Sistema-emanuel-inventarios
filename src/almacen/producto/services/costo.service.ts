import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Costo } from '../entities/costo.entity';
import { Inventario } from '../entities/inventario.entity';

@Injectable()
export class CostoService {
    constructor(
        @InjectRepository(Costo)
        public readonly repository:Repository<Inventario>
        ){}

        async createOne(dto: any) {
            const data = this.repository.create(dto);
            return await this.repository.save(data);
          }
}
