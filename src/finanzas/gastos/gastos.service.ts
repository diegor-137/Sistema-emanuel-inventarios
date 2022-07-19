import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimientoCajaService } from '../movimiento-caja/movimiento-caja.service';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { Gasto } from './entities/gasto.entity';

@Injectable()
export class GastosService {

  constructor( 
  @InjectRepository(Gasto)
  public readonly gastoRepository: Repository<Gasto>,
  private readonly movimientoCajaService: MovimientoCajaService
  ){}


  async create(createGastoDto: CreateGastoDto) {
    const gasto = await this.gastoRepository.save(createGastoDto)
    const {monto, caja} = createGastoDto;
    await this.movimientoCajaService.create(monto, `EGRESO GASTO NO.${gasto.id}`, 2, caja, false) 
  }

  async findAll(start: Date, end:Date, id:number) {
    const st = new Date(start)
    const en = new Date(end)
    en.setDate(en.getDate() + 1);
    return await this.gastoRepository.createQueryBuilder("gastos")
    .leftJoin("gastos.empleado", "empleado")
    .leftJoin("gastos.caja", "caja")
    .leftJoin("caja.empleado", "cajaEmpleado")
    .select(["gastos", "empleado.nombre", "empleado.apellido", "caja.lugar", "cajaEmpleado.nombre", "cajaEmpleado.apellido"])
    .where("caja.id = :id", {id})
    .andWhere("gastos.fecha >= :st", {st})
    .andWhere("gastos.fecha < :en", {en})
    .orderBy("gastos.fecha", "ASC")
    .groupBy("gastos.id, empleado.id, caja.id_caja, cajaEmpleado.id")
    .getMany()
  }
}
