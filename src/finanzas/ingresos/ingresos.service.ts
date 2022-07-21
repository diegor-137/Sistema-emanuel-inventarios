import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { UpdateIngresoDto } from './dto/update-ingreso.dto';
import { Ingreso } from './entities/ingreso.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IngresosService {

  constructor(
    @InjectRepository(Ingreso)
    public readonly ingresoRepository:Repository<Ingreso>,
  ){}

  async create(createIngresoDto: CreateIngresoDto) {
    return await this.ingresoRepository.save(createIngresoDto);
  }

  async findAll(start: Date, end:Date, id:number) {
    const st = new Date(start)
    const en = new Date(end)
    en.setDate(en.getDate() + 1);
    return await this.ingresoRepository.createQueryBuilder("ingreso")
    .where("ingreso.caja.id = :id", {id})
    .andWhere("ingreso.fecha >= :st", {st})
    .andWhere("ingreso.fecha < :en", {en})
    .orderBy("ingreso.fecha", "ASC")
    .groupBy("ingreso.id")
    .getMany()
  }
}
