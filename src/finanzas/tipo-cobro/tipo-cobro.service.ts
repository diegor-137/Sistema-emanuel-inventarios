import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTipoCobroDto } from './dto/create-tipo-cobro.dto';
import { UpdateTipoCobroDto } from './dto/update-tipo-cobro.dto';
import { TipoCobro } from './entities/tipo-cobro.entity';

@Injectable()
export class TipoCobroService {

  constructor(
    @InjectRepository(TipoCobro)
    private readonly tipoCobroRepository: Repository<TipoCobro>,
  ) {}

  async create(createTipoCobroDto: CreateTipoCobroDto) {
    return await this.tipoCobroRepository.save(createTipoCobroDto);;
  }

  async findAll() {
    return await this.tipoCobroRepository.find();
  }

  /** PENDIENTES **/

  findOne(id: number) {
    return `This action returns a #${id} tipoCobro`;
  }

  /** PENDIENTES **/

  update(id: number, updateTipoCobroDto: UpdateTipoCobroDto) {
    return `This action updates a #${id} tipoCobro`;
  }

  /** PENDIENTES **/

  remove(id: number) {
    return `This action removes a #${id} tipoCobro`;
  }
}
