import { Injectable } from '@nestjs/common';
import { CreateTipoGastoDto } from './dto/create-tipo-gasto.dto';
import { UpdateTipoGastoDto } from './dto/update-tipo-gasto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TipoGasto } from './entities/tipo-gasto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TipoGastoService {

  constructor(
    @InjectRepository(TipoGasto)
    public readonly tipoGastoRepository: Repository<TipoGasto>,
  ){}

  async registrarTipoGasto(createTipoGastoDto: CreateTipoGastoDto) {
    return await this.tipoGastoRepository.save(createTipoGastoDto);
  }

  async getAllTipoGastos() {
    return await this.tipoGastoRepository.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoGasto`;
  }

  update(id: number, updateTipoGastoDto: UpdateTipoGastoDto) {
    return `This action updates a #${id} tipoGasto`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoGasto`;
  }
}
