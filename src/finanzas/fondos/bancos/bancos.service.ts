import { Injectable } from '@nestjs/common';
import { CreateBancoDto } from './dto/create-banco.dto';
import { UpdateBancoDto } from './dto/update-banco.dto';
import { Banco } from './entities/banco.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BancosService {

  constructor(
    @InjectRepository(Banco)
    private readonly bancoRepository: Repository<Banco>,
  ) {}
  async create(createBancoDto: CreateBancoDto) {
    return await this.bancoRepository.save(createBancoDto);
  }

  async findAll() {
    return await this.bancoRepository.find();
  }
}
