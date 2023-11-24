import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmpleadoService } from 'src/recursos-humanos/empleado/services/empleado.service';
import { User } from 'src/user/entities/user.entity';
import { Repository, IsNull } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { CorteCajaService } from '../corte-caja/services/corte-caja.service';
import { CreateCorteCajaDto } from '../corte-caja/dto/create-corte-caja.dto';
import { MovimientoCajaService } from '../movimiento-caja/movimiento-caja.service';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';
import { Caja } from './entities/caja.entity';
import { CreateEfectivoDto } from '../fondos/efectivo/dto/create-efectivo.dto';
import { EfectivoService } from '../fondos/efectivo/efectivo.service';

@Injectable()
export class CajaService {

  constructor(
    @InjectRepository(Caja)
    private readonly cajaRepository: Repository<Caja>,
    private readonly empleadoService: EmpleadoService,
    private readonly movimientoCajaService: MovimientoCajaService,
    private readonly corteCajaService: CorteCajaService,
    private readonly efectivoService: EfectivoService
  ) {}

  @Transactional()
  async create(createCajaDto: CreateCajaDto, user:User) {
    const limitCaja = await this.cajaRepository.find({where: {sucursal: {id: user.empleado.sucursal.id}, deletedAt: IsNull(), status: true}})
    //if(limitCaja.length>3)throw new UnauthorizedException('Ya no puede habilitar mas cajas')
    const cajaEmpleado = await this.cajaRepository.findOne({relations: ['empleado'] ,where: {empleado: {id: createCajaDto.empleado.id}}});
    if(cajaEmpleado)throw new UnauthorizedException(`El empleado ${cajaEmpleado.empleado.nombre} ya tiene asignado una caja!`)                                        
    const created = await this.cajaRepository.findOne({where: { nombre: createCajaDto.nombre, sucursal: {id: user.empleado.sucursal.id}}})
    if(created) throw new BadRequestException('Ya existe la caja registrada.')
    createCajaDto.sucursal = user.empleado.sucursal;
    const createEfectivoDto :CreateEfectivoDto={
      detalleEfectivo: [{documento:'', descripcion:'Fondo inical Caja Chica', monto: createCajaDto.montoCajaChica, type:true}],
      nombre: `Caja Chica ${createCajaDto.nombre}`,
      cajaUse:true,
    }
    const efectivo = await this.efectivoService.create(createEfectivoDto, user)
    createCajaDto.efectivo = efectivo
    const caja = await this.cajaRepository.save(createCajaDto);
    await this.movimientoCajaService.create(createCajaDto.monto, 'Fondo de apertura', 3, caja, true);
    let corte : CreateCorteCajaDto = {
      caja:caja, 
      corteCajaDetalle : [
        {monto: createCajaDto.monto, concepto: 'Apertura', type: true },
        {monto: createCajaDto.monto, concepto: 'SALDO', type: true }
      ], 
      empleado:user.empleado
    }
    await this.corteCajaService.save(corte)
    return {message: 'successful', ok: true}
  }

  async findAll(user:User) {
    return await this.cajaRepository.createQueryBuilder("caja")
      .leftJoinAndSelect("caja.empleado", "empleado")
      .select(["caja.id","caja.nombre", "caja.estado","empleado.id", "empleado.nombre", "empleado.apellido", "caja.status"])
      .where("caja.sucursal.id = :id", {id: user.empleado.sucursal.id})
      .orderBy("caja.id", "ASC")
      .getMany();
  }

  async cajeros(user:User){
    return await this.empleadoService.repository.createQueryBuilder('empleado').innerJoin ("empleado.user", "user")
      .select(["empleado.id", "empleado.nombre", "empleado.apellido", "user.roles"])      
      .where("user.roles @> ARRAY[:...roles]", {roles:["CAJERO"]})
      .andWhere("empleado.sucursal.id = :id", {id: user.empleado.sucursal.id})
      .getMany();                           
  }

  /* Deshabilitar */
  @Transactional()
  async update(id: number, user:User) {
    const caja = await this.cajaRepository.findOne({ where: {id, sucursal: {id: user.empleado.sucursal.id}}});
    const {balance} = await this.movimientoCajaService.ultimoMovimiento(caja.id);
    if(balance != 0) throw new BadRequestException(`El saldo de la caja '${caja.nombre}' debe estar a Q.0.00`)
    if(caja.status === true && caja.deletedAt === null){
      caja.estado = 'INACTIVO';
      caja.status = false;
      caja.deletedAt = new Date();
      await this.movimientoCajaService.create(0, 'DESHABILITACION DE CAJA', 3, caja, false);
      return await this.cajaRepository.save(caja);      
    }else{
      const limitCaja = await this.cajaRepository.find({where: {sucursal: {id: user.empleado.sucursal.id}, deletedAt: IsNull(), status: true}})
      //if(limitCaja.length>2)throw new UnauthorizedException('Ya no puede habilitar mas cajas')      
      caja.estado = 'ACTIVO';
      caja.status = true;
      caja.deletedAt = null;
      await this.movimientoCajaService.create(0, 'HABILITACION DE CAJA', 3, caja, true);
      return await this.cajaRepository.save(caja); 
    }
    
  }

  /* FUNCIONES USADAS FUERA DE SU MODULO*/
  async findOne(id:number){
    return await this.cajaRepository.findOne({
    relations: ['efectivo'],
    where: {
      empleado: {id}
    }})
  }
}
