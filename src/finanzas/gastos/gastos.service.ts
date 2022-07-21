import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Caja } from '../caja/entities/caja.entity';
import { IngresosService } from '../ingresos/ingresos.service';
import { MovimientoCajaService } from '../movimiento-caja/movimiento-caja.service';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { Gasto } from './entities/gasto.entity';

@Injectable()
export class GastosService {

  constructor( 
  @InjectRepository(Gasto)
  public readonly gastoRepository: Repository<Gasto>,
  private readonly movimientoCajaService: MovimientoCajaService,
  private readonly ingresosService: IngresosService
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
    .andWhere("gastos.deleted_at IS NUll")
    .orderBy("gastos.fecha", "ASC")
    .groupBy("gastos.id, empleado.id, caja.id_caja, cajaEmpleado.id")
    .getMany()
  }

  async deleteGasto(id:number, user:User, caja:Caja){
      const gasto = await this.gastoRepository.findOne(id, {relations: ['corteCaja']})
      if(!gasto || gasto.deletedAt != null )throw new BadRequestException('El gasto no existe o ya ha sido eliminado')
      gasto.deletedAt = new Date();
      gasto.deleteResponsible = user.empleado; 
      const gastoDeleted = await this.gastoRepository.save(gasto);
      if(gastoDeleted.corteCaja != null)await this.ingresosService.create({caja, descripcion: `Ingreso por anulacion de gasto No. ${gasto.id}`, monto: gastoDeleted.monto});
      delete gastoDeleted.deleteResponsible
      await this.movimientoCajaService.create(gastoDeleted.monto, `INGRESO ANULACION GASTO NO.${gasto.id}`, 1, caja, true) 
      return gasto;
  }

  async findAllDeletedGastos(start: Date, end:Date, id:number){
    const st = new Date(start)
    const en = new Date(end)
    en.setDate(en.getDate() + 1);
    return await this.gastoRepository.createQueryBuilder("gastos")
    .leftJoin("gastos.empleado", "empleado")
    .leftJoin("gastos.deleteResponsible", "deleteResponsible")
    .leftJoin("gastos.caja", "caja")
    .leftJoin("caja.empleado", "cajaEmpleado")
    .select(["gastos", "empleado.nombre", "empleado.apellido", "caja.lugar", "cajaEmpleado.nombre", "cajaEmpleado.apellido", "deleteResponsible.nombre", "deleteResponsible.apellido"])
    .where("caja.id = :id", {id})
    .andWhere("gastos.fecha >= :st", {st})
    .andWhere("gastos.fecha < :en", {en})
    .andWhere("gastos.deleted_at IS NOT NUll")
    .orderBy("gastos.fecha", "ASC")
    .groupBy("gastos.id, empleado.id, caja.id_caja, cajaEmpleado.id, deleteResponsible.id")
    .getMany()
    
  }
}
