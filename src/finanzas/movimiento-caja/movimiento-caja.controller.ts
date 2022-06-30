import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Inject, forwardRef } from '@nestjs/common';
import { MovimientoCajaService } from './movimiento-caja.service';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CajaService } from '../caja/caja.service';
import { User } from 'src/auth/decorators/user.decorator';


@Controller('movimiento-caja')
export class MovimientoCajaController {
  constructor(private readonly movimientoCajaService: MovimientoCajaService,
              private readonly cajaService:CajaService
              ) {}

/*   @Post()
  create(@Body() createMovimientoCajaDto: CreateMovimientoCajaDto) {
    return this.movimientoCajaService.create(createMovimientoCajaDto);
  } */

  /* TODO:USANDO */
  @Auth()
  @Get()
  async findAll(@User()user: UserEntity) {
    const {id} = await this.cajaService.findOne(user.empleado.id)  
    const movimiento = await this.movimientoCajaService.ultimoMovimiento(id);
    return movimiento.balance;
  }

  @Get('all')
  async movimientos(@Query() query: { start: Date, end:Date, id:number }) {    
    return await this.movimientoCajaService.movimientos(query.start, query.end, query.id);
  }

}
