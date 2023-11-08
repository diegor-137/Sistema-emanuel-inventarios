import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoTransaccion } from './entities/tipo-transaccion.entity';
import { CreatetipoTransaccionDto } from './dto/create-tipo-transaccion.dto';


@Injectable()
export class TipoTransaccionService {

  constructor(
    @InjectRepository(TipoTransaccion)
    private readonly tipoTransaccionRepository: Repository<TipoTransaccion>,
  ) {}

  async create(createtipoTransaccionDto: CreatetipoTransaccionDto) {
    return await this.tipoTransaccionRepository.save(createtipoTransaccionDto);;
  }

  async findAll() {
    return await this.tipoTransaccionRepository.find();
  }
}
