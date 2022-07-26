import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { UpdateIngresoDto } from './dto/update-ingreso.dto';
import { Ingreso } from './entities/ingreso.entity';
import { IsNull, Repository } from 'typeorm';
import { CorteCaja } from '../corte-caja/entities/corte-caja.entity';
import { MovimientoCajaService } from '../movimiento-caja/movimiento-caja.service';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class IngresosService {

  constructor(
    @InjectRepository(Ingreso)
    public readonly ingresoRepository:Repository<Ingreso>,
    private readonly movimientoCajaService: MovimientoCajaService,
  ){}


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

  @Transactional()
  async crear(createIngresoDto: CreateIngresoDto) {
    const ingreso = await this.ingresoRepository.save(createIngresoDto);
    const {monto, caja} = createIngresoDto;
    await this.movimientoCajaService.create(monto, `INGRESO MANUAL NO.${ingreso.id}`, 1, caja, true) 
  }

  /* FUNCIONES USADAS FUERA DE SU MODULO*/

  @Transactional({propagation: Propagation.MANDATORY})
  async create(createIngresoDto: CreateIngresoDto) {
    return await this.ingresoRepository.save(createIngresoDto);
  }

  async totalIngresos(id:number){
    return await this.ingresoRepository.createQueryBuilder("ingreso")                                
    .leftJoinAndSelect("ingreso.caja", "caja")
    .leftJoinAndSelect("ingreso.corteCaja", "corte")
    .select('SUM(ingreso.monto)', 'ingreso')
    .where('caja.id = :id', {id})
    .andWhere('corte.id is null')
    .getRawOne() 
  }

  async ingresosCorte(idCorte:number, idCaja:number){
    return await this.ingresoRepository.find({
      where: { caja: {id: idCaja}, corteCaja: {id: idCorte}}
    });
  }

  async ingresos(corte:CorteCaja){
    const ingresos = await this.ingresoRepository.find({
      relations: ["corteCaja"], 
      where: { caja: {id: corte.caja.id}, corteCaja: {id: IsNull()}}
    });
    if(ingresos) {
      ingresos.map(ingreso=> ingreso.corteCaja = corte)
      await this.ingresoRepository.save(ingresos);
    };
  }
}
