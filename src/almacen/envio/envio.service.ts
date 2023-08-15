import { Injectable } from '@nestjs/common';
import { CreateEnvioDto } from './dto/create-envio.dto';
import { UpdateEnvioDto } from './dto/update-envio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Envio } from './entities/envio.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class EnvioService {

  constructor(
    @InjectRepository(Envio)
    public readonly repository:Repository<Envio>)
    {}

  async create(createEnvioDto: CreateEnvioDto, user:User) {
    const envio = this.repository.create(createEnvioDto)
    envio.despachador = user.empleado
    envio.sucursalDespachador = user.empleado.sucursal
    envio.sucursalRecepcionador = createEnvioDto.traslado.sucursalSol;
    envio.status = 'ENVIADO'
    return await this.repository.save(envio)
  }

  async recepcion(id:number, user:User, updateEnvioDto: UpdateEnvioDto){
    const envio = await this.repository.findOne(id, {relations: ['recepcionador']});
    envio.observacionRecepcion = updateEnvioDto.observacionRecepcion
    envio.status = 'ENTREGADO'
    envio.recepcionador = user.empleado
    envio.fechaFin = new Date();
    return await this.repository.save(envio);
  }

  /* Muestra los envios donde se despacharon los productos */
  async envios(user:User, start: Date, end:Date){
    const st = new Date(start)
    const en = new Date(end);
    en.setDate(en.getDate() + 1);

    return (await this.common())
    /*  */      .where("sucursalDespachador.id = :id", {id:user.empleado.sucursal.id})
          //.andWhere("traslado.status = 'PENDIENTE'")
          .andWhere("envio.fechaInicio >= :st", {st})
          .andWhere("envio.fechaInicio < :en", {en})
          .orderBy('envio.fechaInicio', 'DESC')
          .getMany();
  }

  async ultimos5Sucursal(user:User){
    return (await this.common())
    /*  */      .where("sucursalDespachador.id = :id", {id:user.empleado.sucursal.id})
          .orderBy('envio.fechaInicio', 'DESC')
          .limit(5)
          .getMany();
  }

  async ultimos5Local(user:User){
    return (await this.common())
          .where("sucursalRecepcionador.id = :id", {id:user.empleado.sucursal.id})
          .andWhere("envio.status = 'ENTREGADO'")
          .orderBy('envio.fechaFin', 'DESC')
          .limit(5)
          .getMany(); 
  }

  async enviosNoRecepcion(user:User){    
    return (await this.common())
          .where("sucursalRecepcionador.id = :id", {id:user.empleado.sucursal.id})
          .andWhere("envio.recepcionador.id IS NULL")
          .orderBy('envio.fechaInicio', 'DESC')
          .getMany();      
  }

  async findAllEnviosRecepcion(start: Date, end:Date, user:User){
    const st = new Date(start)
    const en = new Date(end);
    en.setDate(en.getDate() + 1);
    return (await this.common())
          .where("sucursalRecepcionador.id = :id", {id:user.empleado.sucursal.id})
          .andWhere("envio.fechaInicio >= :st", {st})
          .andWhere("envio.fechaInicio < :en", {en})
          .andWhere("envio.status = 'ENTREGADO'")
          .orderBy('envio.fechaFin', 'DESC')
          .getMany(); 
  }

  async buscarEnvio(id:number, user:User){
    return (await this.common())
          .where("envio.id = :id", {id})
   /*  */ .andWhere("sucursalDespachador.id = :idSucursal", {idSucursal:user.empleado.sucursal.id})
          .getOne();
  }

  async buscarEnvioRecepcion(id:number, user:User){
    return (await this.common())
          .where("envio.id = :id", {id})
          .andWhere("sucursalRecepcionador.id = :idSucursal", {idSucursal:user.empleado.sucursal.id})
          .getOne();
        }

  async common(){
    const dataSource = await this.repository.createQueryBuilder("envio")
    .leftJoinAndSelect("envio.traslado", "traslado")
    .leftJoinAndSelect("traslado.detalle", "detalle")
    .leftJoinAndSelect("detalle.producto", "producto")
    .leftJoinAndSelect("envio.despachador", "despachador")
    .leftJoinAndSelect("envio.sucursalDespachador", "sucursalDespachador")
    .leftJoinAndSelect("envio.recepcionador", "recepcionador")
    .leftJoinAndSelect("envio.sucursalRecepcionador", "sucursalRecepcionador")

    return dataSource;
  }
}
