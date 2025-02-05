import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { IsNull, Repository } from 'typeorm';
import { Caja } from '../caja/entities/caja.entity';
import { IngresosService } from '../ingresos/ingresos.service';
import { MovimientoCajaService } from '../movimiento-caja/movimiento-caja.service';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { Gasto } from './entities/gasto.entity';
import { CorteCaja } from '../corte-caja/entities/corte-caja.entity';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { FilesService } from 'src/files/file.service';
import { EfectivoService } from '../fondos/efectivo/efectivo.service';
import { CreateDetalleEfectivoDto } from '../fondos/efectivo/dto/create-detalle-efectivo.dto';

@Injectable()
export class GastosService {

  constructor( 
  @InjectRepository(Gasto)
  public readonly gastoRepository: Repository<Gasto>,
  //private readonly movimientoCajaService: MovimientoCajaService,
  private readonly EfectivoService: EfectivoService,
  private readonly ingresosService: IngresosService,
  private readonly filesService:FilesService
  ){}

  @Transactional()
  async create(createGastoDto: CreateGastoDto, foto:Express.Multer.File, user:User) {
    const {balance} = await this.EfectivoService.ultimoMovimiento(createGastoDto.efectivo.id);
    if(Number(createGastoDto.monto)>Number(balance)) throw new BadRequestException('El gasto no puede ser mayor al monto que se tiene disponible!')
    const uploadResult = await this.filesService.uploadPublicFile(foto.buffer, foto.originalname, `${createGastoDto.documento}-${createGastoDto.empleado.sucursal.nombre}-${createGastoDto.monto}`); 
    createGastoDto.foto = uploadResult
    createGastoDto.sucursal = user.empleado.sucursal;
    const gasto = await this.gastoRepository.save(createGastoDto)
    const CreateDetalleEfectivoDto:CreateDetalleEfectivoDto={
      documento: `${gasto.documento}`,
      descripcion: `GASTO ${gasto.descripcion}`,
      monto: gasto.monto,
      type: false
    }
    await this.EfectivoService.transaccion(CreateDetalleEfectivoDto, user, createGastoDto.efectivo.id);
    return true; 
  }

  @Transactional()
  async deleteGasto(id:number, user:User){
/*     const gasto = await this.gastoRepository.findOne(id, {relations: ['corteCaja', 'foto']})
    if(!gasto || gasto.deletedAt != null )throw new BadRequestException('El gasto no existe o ya ha sido eliminado')
    const idArchivo= gasto.foto.id
    gasto.foto = null
    gasto.deletedAt = new Date();
    gasto.deleteResponsible = user.empleado; 
    const gastoDeleted = await this.gastoRepository.save(gasto);
    if(gastoDeleted.corteCaja != null)await this.ingresosService.create({caja, descripcion: `Ingreso por anulacion de gasto No. ${gasto.id}`, monto: gastoDeleted.monto});
    await this.filesService.deletePublicFile(idArchivo);
    delete gastoDeleted.deleteResponsible
    await this.movimientoCajaService.create(gastoDeleted.monto, `INGRESO ANULACION GASTO NO.${gasto.id}`, 1, caja, true) 
    return gasto; */
}

  async findAll(start: Date, end:Date, user:User) {
    const st = new Date(start)
    const en = new Date(end)
    en.setDate(en.getDate() + 1);
    /* return await this.gastoRepository.createQueryBuilder("gastos")
    .leftJoin("gastos.foto", "foto")
    .leftJoin("gastos.empleado", "empleado")
    .leftJoin("gastos.tipoGasto", "tipoGasto")
    .leftJoin("gastos.sucursal", "sucursal")
    .select(["gastos", "empleado.nombre", "empleado.apellido", "foto", 
    "tipoGasto.id", "tipoGasto.nombre"
    ])
    .where("gastos.sucursal.id = :id", {id:user.empleado.sucursal.id})
    .andWhere("gastos.fecha >= :st", {st})
    .andWhere("gastos.fecha < :en", {en})
    .andWhere("gastos.deleted_at IS NUll")
    .orderBy("gastos.fecha", "ASC")
    .groupBy("gastos.id, empleado.id, foto.id, tipoGasto.id, sucursal.id")
    .getMany() */
    return await this.gastoRepository.createQueryBuilder("gastos")
    .leftJoin("gastos.foto", "foto")
    .leftJoin("gastos.empleado", "empleado")
    .leftJoin("gastos.tipoGasto", "tipoGasto")
    .leftJoin("gastos.sucursal", "sucursal")
    .select(["gastos", "empleado.nombre", "empleado.apellido", "foto", 
    "tipoGasto.id", "tipoGasto.nombre"
    ])
    .where("gastos.sucursal.id = :id", {id:user.empleado.sucursal.id})
    .andWhere("gastos.fecha >= :st", {st})
    .andWhere("gastos.fecha < :en", {en})
    .andWhere("gastos.deleted_at IS NUll")
    .orderBy("gastos.fecha", "ASC")
    .groupBy("gastos.id, empleado.id, foto.id, tipoGasto.id, sucursal.id")
    .getMany()
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
    .select(["gastos", "empleado.nombre", "empleado.apellido", "caja.nombre", "cajaEmpleado.nombre", "cajaEmpleado.apellido", "deleteResponsible.nombre", "deleteResponsible.apellido"])
    .where("caja.id = :id", {id})
    .andWhere("gastos.fecha >= :st", {st})
    .andWhere("gastos.fecha < :en", {en})
    .andWhere("gastos.deleted_at IS NOT NUll")
    .orderBy("gastos.fecha", "ASC")
    .groupBy("gastos.id, empleado.id, caja.id_caja, cajaEmpleado.id, deleteResponsible.id")
    .getMany()
    
  }



  /* FUNCIONES USADAS FUERA DE SU MODULO*/
/* 
  async totalGasto(id:number){
    return await this.gastoRepository.createQueryBuilder("gastos")                                
    .leftJoinAndSelect("gastos.caja", "caja")
    .leftJoinAndSelect("gastos.corteCaja", "corte")
    .select('SUM(gastos.monto)', 'gasto')
    .where('caja.id = :id', {id})
    .andWhere('corte.id is null')
    .andWhere('gastos.deletedAt is null')
    .getRawOne() 
  } */

/*   async gastosCorte(idCorte:number, idCaja:number){
    return await this.gastoRepository.find({
      where: { caja: {id: idCaja}, corteCaja: {id: idCorte}}
    });
  } */

/*   async gastos(corte:CorteCaja){
    const gastos = await this.gastoRepository.find({
      relations: ["corteCaja"], 
      where: { caja: {id: corte.caja.id}, corteCaja: {id: IsNull()}, deletedAt:IsNull()}
    });
    if(gastos) {
      gastos.map(gasto=> gasto.corteCaja = corte)
      await this.gastoRepository.save(gastos);
    };
  } */

}
