import { Injectable } from '@nestjs/common';
import { CreateRecepcionDto } from './dto/create-recepcion.dto';
import { UpdateRecepcionDto } from './dto/update-recepcion.dto';

@Injectable()
export class RecepcionService {
  create(createRecepcionDto: CreateRecepcionDto) {
    return 'This action adds a new recepcion';
  }

  findAll() {
    return `This action returns all recepcion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recepcion`;
  }

  update(id: number, updateRecepcionDto: UpdateRecepcionDto) {
    return `This action updates a #${id} recepcion`;
  }

  remove(id: number) {
    return `This action removes a #${id} recepcion`;
  }
}
