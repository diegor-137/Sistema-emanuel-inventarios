import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
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

  @Auth()
  @Get()
  async findAll(
    @Query('id', ParseIntPipe)id: number, 
    @Query('start')start: Date, 
    @Query('end')end: Date, 
    @User() user: UserEntity){    
    if(id===0){    
      const caja = await this.cajaService.findOne(user.empleado.id)
      id = caja.id
    }    
    return this.gastosService.findAll(start, end, id);
  }

  @Auth()
  @Delete('delete/:id')
  async deleteGasto(@Param('id') id: number, @User() user: UserEntity){
    const caja = await this.cajaService.findOne(user.empleado.id)    
    return this.gastosService.deleteGasto(id, user, caja);
  }

  @Auth()
  @Get('deleted/all')
  async findAllDeletedGastos(@Query('id', ParseIntPipe)id: number,@Query('start')start: Date,@Query('end')end: Date){
    return this.gastosService.findAllDeletedGastos(start, end, id);
  }

}
