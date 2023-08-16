import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { CreateCuentaBancariaDto } from './dto/create-cuenta-bancaria.dto';
import { CuentaBancariaService } from './cuenta-bancaria.service';


@Controller('cuenta-bancaria')
export class CuentaBancariaController {
  constructor(private readonly CuentaBancariaService:CuentaBancariaService){}

  @Auth()
  @Post()
  async create(@Body() CreateCuentaBancariaDto: CreateCuentaBancariaDto, @User() user: UserEntity) {
    return this.CuentaBancariaService.create(CreateCuentaBancariaDto, user);
  }

}
