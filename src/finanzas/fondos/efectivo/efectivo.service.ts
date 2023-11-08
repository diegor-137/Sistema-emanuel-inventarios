import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEfectivoDto } from './dto/create-efectivo.dto';
import { UpdateEfectivoDto } from './dto/update-efectivo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Efectivo } from './entities/efectivo.entity';
import { Repository } from 'typeorm';
import { DetalleEfectivo } from './entities/detalle-efectivo';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { User } from 'src/user/entities/user.entity';
import { CreateDetalleEfectivoDto } from './dto/create-detalle-efectivo.dto';
import { CreateDetalleCuentaBancariaDto } from '../cuenta-bancaria/dto/create-detalle-cuenta-bancaria.dto';
import { Caja } from 'src/finanzas/caja/entities/caja.entity';

@Injectable()
export class EfectivoService {

  constructor(
    @InjectRepository(Efectivo)
    public readonly efectivoRepository: Repository<Efectivo>,
    @InjectRepository(DetalleEfectivo)
    public readonly detalleEfectivoRepository: Repository<DetalleEfectivo>,
  ) { }

  @Transactional()
  async create(CreateEfectivoDto:CreateEfectivoDto, user:User){
    CreateEfectivoDto.empleado = user.empleado
    CreateEfectivoDto.sucursal = user.empleado.sucursal
    CreateEfectivoDto.detalleEfectivo.forEach((data)=>{
      data.balance = data.monto,
      data.empleado = user.empleado
    })
    const efectivo = this.efectivoRepository.create(CreateEfectivoDto);
    return this.efectivoRepository.save(efectivo);
  }

  async transaccion(createDetalleEfectivoDto:CreateDetalleEfectivoDto, user:User, id:number){
    const {balance} = await this.ultimoMovimiento(id);
    if(Number(createDetalleEfectivoDto.monto)>Number(balance) && createDetalleEfectivoDto.type == false){
      throw new BadRequestException('El egreso no puede ser mayor al monto que se tiene en efectivo!')
    }
    const efectivo:Efectivo={id}
    createDetalleEfectivoDto.empleado = user.empleado
    createDetalleEfectivoDto.efectivo = efectivo;
    let balance1:number;
    switch (createDetalleEfectivoDto.type) {
      case true:balance1 = Number(balance) + Number(createDetalleEfectivoDto.monto) ;        
        break;
      case false:balance1 = Number(balance) - Number(createDetalleEfectivoDto.monto);
        break;     
    }    
    createDetalleEfectivoDto.balance = balance1;
    return await this.detalleEfectivoRepository.save(createDetalleEfectivoDto);    


  } 

  async ultimoMovimiento(idCuenta:number){
    return await this.detalleEfectivoRepository.createQueryBuilder("detalle_efectivo")
    .where("detalle_efectivo.efectivo.id = :idCuenta", {idCuenta})
    .andWhere((qb)=>{const subQuery= qb.subQuery()
                  .select("MAX(detalle_efectivo.fecha)", "fecha")
                  .from(DetalleEfectivo, "detalle_efectivo")                  
                  .where("detalle_efectivo.efectivo.id = :idCuenta", {idCuenta})
                  .getQuery()
                  return "detalle_efectivo.fecha = " + subQuery})
    .getOne()
  }


  async getCuentas(user:User, cajaUse:boolean, caja?:Caja){

    return await this.efectivoRepository.createQueryBuilder('efectivo')
    .leftJoinAndSelect(
      "efectivo.detalleEfectivo", "detalleEfectivo", 
      "detalleEfectivo.efectivo.id=efectivo.id"
    )
    .leftJoinAndSelect("efectivo.caja", "caja")
    .where("efectivo.sucursal.id = :idSucursal", {idSucursal:user.empleado.sucursal.id})
    .andWhere("efectivo.cajaUse = :cajaUse", {cajaUse}) 
    .andWhere(cajaUse? "efectivo.id = :idEfectivo" : 'TRUE', {idEfectivo:caja?.efectivo.id}) 
    .andWhere(
      (query) =>
      "detalleEfectivo.id=" +
      query
        .subQuery()
        .select("id")
        .from(DetalleEfectivo, "d")
        .where("efectivo.id=d.efectivo.id")
        .orderBy("fecha", "DESC")
        .limit(1)
        .getQuery()
    )
    .orWhere("detalleEfectivo.id IS NULL")
    .orderBy("efectivo.fecha", "ASC")
    .getMany()

    /* BUSCAR LA CUENTA Y MOSTRAR SU ULTIMO REGISTRO DE SU TABLA HIJA */
  }

  async getCuentasDetail(id:number, user:User){
    return (await this.common())
          .where("efectivo.sucursal.id = :idSucursal", {idSucursal:user.empleado.sucursal.id})
          .andWhere("efectivo.id = :idCuenta", {idCuenta:id})
          .getOne()
  }

  async common(){
    const repo = await this.efectivoRepository.createQueryBuilder("efectivo")
    .leftJoinAndSelect("efectivo.detalleEfectivo", "detalleEfectivo")
    return repo;
  }

  async getEfectivoEncabezado(user:User){
    return await this.efectivoRepository.createQueryBuilder("efectivo")
    .where("efectivo.sucursal.id = :idSucursal", {idSucursal:user.empleado.sucursal.id})
    .andWhere("efectivo.cajaUse = FALSE", {idSucursal:user.empleado.sucursal.id})
    .getMany();
  }
}
