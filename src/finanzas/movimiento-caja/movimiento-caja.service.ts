import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { Caja } from '../caja/entities/caja.entity';
import { CreateMovimientoCajaDto } from './dto/create-movimiento-caja.dto';
import { MovimientoCaja } from './entities/movimiento-caja.entity';

@Injectable()
export class MovimientoCajaService {

  constructor(
    @InjectRepository(MovimientoCaja)
    private readonly movimientoCajaRepository: Repository<MovimientoCaja>,
  ) {}

  @Transactional({propagation: Propagation.REQUIRED})
  async create(monto:number, descripcion:string, num: number, caja?:Caja, type?:boolean) {
    const movimiento : CreateMovimientoCajaDto = {
      monto, descripcion, caja, type
    }    
    let balance:number;
    const ultimoMovimiento = await this.ultimoMovimiento(caja.id)
    switch (num) {
      case 1:balance = Number(movimiento.monto) + Number(ultimoMovimiento.balance) ;        
        break;
      case 2:balance = Number(ultimoMovimiento.balance) - Number(movimiento.monto);
        break;
      case 3:balance = Number(movimiento.monto);
        break;        
    }    
    movimiento.balance = balance;
    return await this.movimientoCajaRepository.save(movimiento);
  }

  async ultimoMovimiento(id:number){
    return await this.movimientoCajaRepository.createQueryBuilder("movimiento_caja")
    .where("movimiento_caja.caja.id = :id", {id})
    .andWhere((qb)=>{const subQuery= qb.subQuery()
                  .select("MAX(movimiento_caja.fecha)", "fecha")
                  .from(MovimientoCaja, "movimiento_caja")                  
                  .where("movimiento_caja.caja.id = :id", {id})
                  .getQuery()
                  return "movimiento_caja.fecha = " + subQuery})
    .getOne()
  }

  async movimientos(start: Date, end:Date, id:number){
    const st = new Date(start)
    const en = new Date(end);
    en.setDate(en.getDate() + 1);
    return await this.movimientoCajaRepository.find({
      where: {
        caja: {id},
        fecha: Between(st, en)
      },      
      order: {
        fecha: 'ASC'
      }            
    })
  }
}
