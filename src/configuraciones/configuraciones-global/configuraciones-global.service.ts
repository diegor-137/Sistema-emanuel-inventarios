import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConfiguracionesGlobalDto } from './dto/create-configuraciones-global.dto';
import { UpdateConfiguracionesGlobalDto } from './dto/update-configuraciones-global.dto';
import { ConfiguracionesGlobal } from './entities/configuraciones-global.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ConfiguracionesGlobalService {

  constructor(
    @InjectRepository(ConfiguracionesGlobal)
    private readonly configuracionesGlobalRepository: Repository<ConfiguracionesGlobal>,
  ) {}

  async create(createConfiguracionesGlobalDto: CreateConfiguracionesGlobalDto) {
    createConfiguracionesGlobalDto.cuentaBancaria?null:createConfiguracionesGlobalDto.cuentaBancaria = null;
    const configuracion = this.configuracionesGlobalRepository.create(createConfiguracionesGlobalDto);
    return await this.configuracionesGlobalRepository.save(configuracion);
  }

  async getConfiguraciones(user:User) {
    return await this.configuracionesGlobalRepository.createQueryBuilder('configuracion-global')
      .leftJoinAndSelect('configuracion-global.efectivo', 'efectivo')
      .leftJoinAndSelect('configuracion-global.cuentaBancaria', 'cuentaBancaria')
      .leftJoinAndSelect('cuentaBancaria.banco', 'banco')
      .select(["configuracion-global.id", "efectivo.id", "efectivo.nombre", 
      "cuentaBancaria.id", "cuentaBancaria.nombre", "cuentaBancaria.numero", "banco.nombre"])
      .where('configuracion-global.sucursal.id = :sucursalId', {sucursalId:user.empleado.sucursal.id})
      .getOne()
  }

}
