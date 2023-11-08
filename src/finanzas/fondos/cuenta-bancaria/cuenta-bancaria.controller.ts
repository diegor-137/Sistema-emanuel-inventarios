import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { CreateCuentaBancariaDto } from './dto/create-cuenta-bancaria.dto';
import { CuentaBancariaService } from './cuenta-bancaria.service';
import { CreateDetalleCuentaBancariaDto } from './dto/create-detalle-cuenta-bancaria.dto';


@Controller('cuenta-bancaria')
export class CuentaBancariaController {
  constructor(private readonly CuentaBancariaService:CuentaBancariaService){}

  @Auth()
  @Post()
  async create(@Body() CreateCuentaBancariaDto: CreateCuentaBancariaDto, @User() user: UserEntity) {
    return this.CuentaBancariaService.create(CreateCuentaBancariaDto, user);
  }

  @Auth()
  @Post('transaccion')
  async transaccion(
    @Body() createCuentaBancariaDto: CreateCuentaBancariaDto, @User() user: UserEntity) {
      return this.CuentaBancariaService.transaccion(createCuentaBancariaDto.detalleCuentaBancaria[0], user, createCuentaBancariaDto.id);
  }

  @Auth()
  @Get()
  async getCuentas(@User() user: UserEntity) {
    return this.CuentaBancariaService.getCuentas(user);
  }

  @Auth()
  @Get('detail/:id')
  async getCuentasDetail(@User() user: UserEntity, @Param('id', ParseIntPipe) id: number) {
    return this.CuentaBancariaService.getCuentasDetail(id, user);
  }

  @Auth()
  @Get('cuentas-encabezado')
  async getCuentasEncabezado(@User() user: UserEntity){    
    return this.CuentaBancariaService.getCuentasEncabezado(user);
  }



}
