import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';
import { Caja } from './entities/caja.entity';

@Injectable()
export class CajaService {

  constructor(
    @InjectRepository(Caja)
    private readonly cajaRepository: Repository<Caja>,
  ) {}


  create(createCajaDto: CreateCajaDto) {
    return this.cajaRepository.save(createCajaDto);
  }

  findAll() {
    return this.cajaRepository.find();
  }

  /** PENDIENTES **/

  findOne(id: number) {
    return `This action returns a #${id} caja`;
  }

  /** PENDIENTES **/

  update(id: number, updateCajaDto: UpdateCajaDto) {
    return `This action updates a #${id} caja`;
  }

  /** PENDIENTES **/
  
  remove(id: number) {
    return `This action removes a #${id} caja`;
  }
}
