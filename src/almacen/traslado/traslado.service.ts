import { Injectable } from '@nestjs/common';
import { CreateTrasladoDto } from './dto/create-traslado.dto';
import { UpdateTrasladoDto } from './dto/update-traslado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Traslado } from './entities/traslado.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { ExistenciaVentaService } from 'src/ventas/venta/services/existencia-venta.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class TrasladoService {

  constructor(
    @InjectRepository(Traslado)
    public readonly repository:Repository<Traslado>,
    private readonly existencia:ExistenciaVentaService,)
    {}

  /* Solicitar una traslado, sucursal local */  
  async createOne(createTrasladoDto: CreateTrasladoDto){
    const traslado = this.repository.create(createTrasladoDto)
    return this.repository.save(traslado);
  }

  /* Autorizar traslado, sucursal remota */
  @Transactional()
  async autorizarTraslado(id:number, user:User){
    const traslado = await this.repository.findOne(id, {relations: ['sucursalSol', 'detalle', 'detalle.producto']});
    traslado.status = 'AUTORIZADO';
    traslado.responsable = user.empleado;
    traslado.sucursalResp = user.empleado.sucursal;
    traslado.autorizarDate = new Date();
    await this.existencia.movimientosPorTraslado(traslado)
    return await this.repository.save(traslado)
  }

  /* Listado de traslados locales autorizados/no autorizados */

  async findAllTrasladosPorSucursalLocal(user:User) {
    return (await this.common())
          .select(["traslado.id", "traslado.observacion", "traslado.createdAt", "traslado.status",
          "solicitador.nombre", "solicitador.apellido", "sucursalSol.nombre", "sucursalResp.nombre", "detalle.cantidad",
          "producto.id", "producto.nombre"])
          .where("sucursalSol.id = :id", {id:user.empleado.sucursal.id})
          .andWhere("traslado.status = 'PENDIENTE'")
          .orderBy('traslado.createdAt', 'DESC')
          .getMany();
  }

  /* Listado de traslados pendientes de autorizacion, sucursal remota */
  async findAllTrasladosPorSucursal(user:User) {
    return (await this.common())
          .select(["traslado.id", "traslado.observacion", "traslado.createdAt", "traslado.status",
          "solicitador.nombre", "solicitador.apellido", "sucursalSol.nombre", "sucursalResp.nombre", "detalle.cantidad",
          "producto.id", "producto.nombre"])
          .where("sucursalResp.id = :id", {id:user.empleado.sucursal.id})
          .andWhere("traslado.status = 'PENDIENTE'")
          .orderBy('traslado.createdAt', 'DESC')
          .getMany();
  }

  /* Listado de traslados pendites de envio, sucursal remota */
  async findAllTrasladosNoEnvio(user:User){
    return (await this.common())
          .leftJoinAndSelect("traslado.envio", "envio")
          .select(["traslado.id", "traslado.observacion", "traslado.createdAt", "traslado.autorizarDate", "traslado.status",
          "solicitador.nombre", "solicitador.apellido", "sucursalSol.id", "sucursalSol.nombre", "responsable.nombre", "responsable.apellido", "sucursalResp.nombre", 
          "detalle.cantidad", "producto.id", "producto.nombre", "envio"])
          .where("sucursalResp.id = :id", {id:user.empleado.sucursal.id})
          .andWhere("envio IS NULL")
          .andWhere("traslado.status = 'AUTORIZADO'")
          .orderBy('traslado.createdAt', 'DESC')
          .getMany();
  }

  /* CONSULTAS */

  async getTrasladosPorfechaSucusal(start: Date, end:Date, user:User){
    const st = new Date(start)
    const en = new Date(end);
    en.setDate(en.getDate() + 1);
    return (await this.common())
            .where("sucursalResp.id = :id", {id:user.empleado.sucursal.id})
            .andWhere("traslado.status = 'AUTORIZADO'")
            .andWhere("traslado.createdAt >= :st", {st})
            .andWhere("traslado.createdAt < :en", {en})
            .orderBy('traslado.autorizarDate', 'DESC')
            .getMany();
  }

  async ultimos5Sucursal(user:User){
    return (await this.common())
            .where("sucursalResp.id = :id", {id:user.empleado.sucursal.id})
            .andWhere("traslado.status = 'AUTORIZADO'")
            .orderBy('traslado.autorizarDate', 'DESC')
            .limit(5)
            .getMany();
  }

  async getTrasladosPorfechaLocal(start: Date, end:Date, user:User){
    const st = new Date(start)
    const en = new Date(end);
    en.setDate(en.getDate() + 1);
    return (await this.common())
            .where("sucursalSol.id = :id", {id:user.empleado.sucursal.id})
            .andWhere("traslado.status = 'AUTORIZADO'")
            .andWhere("traslado.createdAt >= :st", {st})
            .andWhere("traslado.createdAt < :en", {en})
            .orderBy('traslado.createdAt', 'DESC')
            .getMany();
  }

  async ultimos5local(user:User){
    return (await this.common())
            .where("sucursalSol.id = :id", {id:user.empleado.sucursal.id})
            .andWhere("traslado.status = 'AUTORIZADO'")
            .orderBy('traslado.createdAt', 'DESC')
            .limit(5)
            .getMany();
  }

  async buscarTrasladoLocal(idtraslado:number, user:User){
    return (await this.common())
          .where("traslado.id = :idtraslado", {idtraslado})
          .andWhere("sucursalSol.id = :id", {id:user.empleado.sucursal.id})
          .getOne();
  }

  async buscarTraslado(idtraslado:number, user:User){
    return (await this.common())
          .where("traslado.id = :idtraslado", {idtraslado})
          .andWhere("sucursalResp.id = :id", {id:user.empleado.sucursal.id})
          .getOne();
  }

  async common(){
    const repo = await this.repository.createQueryBuilder("traslado")
    .leftJoinAndSelect("traslado.solicitador", "solicitador")
    .leftJoinAndSelect("traslado.sucursalSol", "sucursalSol")
    .leftJoinAndSelect("traslado.sucursalResp", "sucursalResp")
    .leftJoinAndSelect("traslado.responsable", "responsable")
    .leftJoinAndSelect("traslado.detalle", "detalle")
    .leftJoinAndSelect("detalle.producto", "producto")
    return repo;
  }

}
