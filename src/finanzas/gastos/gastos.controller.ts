import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GastosService } from './gastos.service';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { CajaService } from '../caja/caja.service';
import { AuthService } from '../../auth/auth.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';

@Controller('gastos')
export class GastosController {
  constructor(private readonly gastosService: GastosService,
              private readonly cajaService:CajaService,
              private readonly authService:AuthService){}

  @Auth()
  @Post()
  async create(@Body() createGastoDto: CreateGastoDto, @User() user: UserEntity) {
    const decodedJwtAccessToken = await this.authService.decodeToken(createGastoDto.token);
    const caja = await this.cajaService.findOne(user.empleado.id)
    createGastoDto.empleado= decodedJwtAccessToken.empleado
    createGastoDto.caja= caja
    return this.gastosService.create(createGastoDto);
  }

  @Get()
  findAll(@Query() query: { start: Date, end:Date, id:number }) {
    return this.gastosService.findAll(query.start, query.end, query.id);
  }

}
