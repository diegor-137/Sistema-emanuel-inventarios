import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CreateEgresoDto } from './dto/create-egreso.dto';
import { Egreso } from './entities/egreso.entity';
import { CorteCaja } from '../corte-caja/entities/corte-caja.entity';
import { MovimientoCajaService } from '../movimiento-caja/movimiento-caja.service';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class EgresosService {

constructor(
    @InjectRepository(Egreso)
       public readonly egresoRepository:Repository<Egreso>,
       private readonly movimientoCajaService: MovimientoCajaService,
    ){}
async findAll(start: Date, end:Date, id:number) {
      const st = new Date(start)
      const en = new Date(end)
      en.setDate(en.getDate() + 1);
      return await this.egresoRepository.createQueryBuilder("egreso")
      .where("egreso.caja.id = :id", {id})
      .andWhere("egreso.fecha >= :st", {st})
      .andWhere("egreso.fecha < :en", {en})
      .orderBy("egreso.fecha", "ASC")
      .groupBy("egreso.id")
      .getMany()
}

@Transactional()
  async crear(createEgresoDto: CreateEgresoDto) {
    const egreso = await this.egresoRepository.save(createEgresoDto);
    const {monto, caja} = createEgresoDto;
    await this.movimientoCajaService.create(monto, `EGRESO MANUAL NO.${egreso.id}`, 2, caja, false) 
  }


/* FUNCIONES USADAS FUERA DE SU MODULO*/

@Transactional({propagation: Propagation.MANDATORY})
async create(createIngresoDto: CreateEgresoDto) {
  const {balance} = await this.movimientoCajaService.ultimoMovimiento(createIngresoDto.caja.id);
    if(createIngresoDto.monto>balance) throw new BadRequestException('El egreso no puede ser mayor al que se tiene en caja!') 
    return await this.egresoRepository.save(createIngresoDto);
}

async totalEgresos(id:number){
    return await this.egresoRepository.createQueryBuilder("egreso")                                
    .leftJoinAndSelect("egreso.caja", "caja")
    .leftJoinAndSelect("egreso.corteCaja", "corte")
    .select('SUM(egreso.monto)', 'egreso')
    .where('caja.id = :id', {id})
    .andWhere('corte.id is null')
    .getRawOne() 
  }

  async egresosCorte(idCorte:number, idCaja:number){
    return await this.egresoRepository.find({
      where: { caja: {id: idCaja}, corteCaja: {id: idCorte}}
    });
  }

  async egresos(corte:CorteCaja){
    const egresos = await this.egresoRepository.find({
      relations: ["corteCaja"], 
      where: { caja: {id: corte.caja.id}, corteCaja: {id: IsNull()}}
    });
    if(egresos) {
      egresos.map(egreso=> egreso.corteCaja = corte)
      await this.egresoRepository.save(egresos);
    };
  }
}
