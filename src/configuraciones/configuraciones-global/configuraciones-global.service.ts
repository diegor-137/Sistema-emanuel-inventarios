import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConfiguracionesGlobalDto } from './dto/create-configuraciones-global.dto';
import { UpdateConfiguracionesGlobalDto } from './dto/update-configuraciones-global.dto';
import { ConfiguracionesGlobal } from './entities/configuraciones-global.entity';

@Injectable()
export class ConfiguracionesGlobalService {

  constructor(
    @InjectRepository(ConfiguracionesGlobal)
    private readonly repository: Repository<ConfiguracionesGlobal>,
  ) {}

  create(createConfiguracionesGlobalDto: CreateConfiguracionesGlobalDto[]) {
    return this.repository.save(createConfiguracionesGlobalDto);
  }

  findAll() {
    return this.repository.find({order: {id: 'ASC'}});
  }

  findPermissions() {
    return this.repository.find({where: {checked: true}, order: {id: 'ASC'}});
  }

  findOne(id: number) {
    return `This action returns a #${id} configuracionesGlobal`;
  }

  update(id: number, updateConfiguracionesGlobalDto: UpdateConfiguracionesGlobalDto) {
    return `This action updates a #${id} configuracionesGlobal`;
  }

  remove(id: number) {
    return `This action removes a #${id} configuracionesGlobal`;
  }
}
