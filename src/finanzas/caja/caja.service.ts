import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmpleadoService } from 'src/recursos-humanos/empleado/empleado.service';
import { Repository } from 'typeorm';
import { CorteCajaService } from '../corte-caja/corte-caja.service';
import { CreateCorteCajaDto } from '../corte-caja/dto/create-corte-caja.dto';
import { MovimientoCajaService } from '../movimiento-caja/movimiento-caja.service';
import { CreateCajaDto } from './dto/create-caja.dto';
import { UpdateCajaDto } from './dto/update-caja.dto';
import { Caja } from './entities/caja.entity';

@Injectable()
export class CajaService {

  constructor(
    @InjectRepository(Caja)
    private readonly cajaRepository: Repository<Caja>,
    private readonly empleadoService: EmpleadoService,
    private readonly movimientoCajaService: MovimientoCajaService,
    private readonly corteCajaService: CorteCajaService
  ) {}


  async create(createCajaDto: CreateCajaDto) {
    const created = await this.cajaRepository.findOne({where: { lugar: createCajaDto.lugar}})
    if(created) throw new BadRequestException('Ya existe la caja registrada.')
    const caja = await this.cajaRepository.save(createCajaDto);
    await this.movimientoCajaService.create(createCajaDto.monto, 'FONDO DE APERTURA', 3, caja, true);
    let corte : CreateCorteCajaDto = {
      caja:caja, corteCajaDetalle : [{monto: createCajaDto.monto, concepto: 'APERTURA', type: true }], empleado:createCajaDto.empleado
    }
    await this.corteCajaService.corteCajaRepository.save(corte)
    return {message: 'successful', ok: true}
  }

  async findAll() {
    return await this.cajaRepository.createQueryBuilder("caja")
      .leftJoinAndSelect("caja.empleado", "empleado")
      .select(["caja.id","caja.lugar", "caja.estado","empleado.id", "empleado.nombre", "empleado.apellido"])
      .getMany();
  }

  async cajeros(){
    return await this.empleadoService.repository.createQueryBuilder('empleado').innerJoin ("empleado.user", "user")
      .select(["empleado.id", "empleado.nombre", "empleado.apellido", "user.roles"])      
      .where("user.roles @> ARRAY[:...roles]", {roles:["CAJERO"]})
      .getMany();                           
  }

  async update(id: number) {
    const caja = await this.cajaRepository.findOne({ where: {id}});
    caja.estado = 'INACTIVO';
    return await this.cajaRepository.save(caja);
  }

  async findOne(id:number){
    return this.cajaRepository.findOne({where: {
      empleado: {id}
    }})
  }
}
