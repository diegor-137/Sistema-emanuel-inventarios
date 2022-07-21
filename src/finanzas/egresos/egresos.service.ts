import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEgresoDto } from './dto/create-egreso.dto';
import { Egreso } from './entities/egreso.entity';

@Injectable()
export class EgresosService {

constructor(
    @InjectRepository(Egreso)
       public readonly egresoRepository:Repository<Egreso>,
    ){}

async create(createIngresoDto: CreateEgresoDto) {
    return await this.egresoRepository.save(createIngresoDto);
}
}
