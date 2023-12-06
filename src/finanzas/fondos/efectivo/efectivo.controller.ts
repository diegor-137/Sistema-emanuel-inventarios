import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EfectivoService } from './efectivo.service';
import { CreateEfectivoDto } from './dto/create-efectivo.dto';
import { UpdateEfectivoDto } from './dto/update-efectivo.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('efectivo')
export class EfectivoController {
  constructor(private readonly efectivoService: EfectivoService) {}

  @Auth()
  @Post()
  create(@Body() createEfectivoDto: CreateEfectivoDto, @User() user: UserEntity) {
    return this.efectivoService.create(createEfectivoDto, user);
  }

  @Auth()
  @Post('transaccion')
  async transaccion(
    @Body() createEfectivoDto: CreateEfectivoDto, @User() user: UserEntity) {
      return this.efectivoService.transaccion(createEfectivoDto.detalleEfectivo[0], user, createEfectivoDto.id);
  }

  @Auth()
  @Get()
  async getCuentas(@User() user: UserEntity) {
    return this.efectivoService.getCuentas(user);
  }

  @Auth()
  @Get('detail/:id')
  async getCuentasDetail(@User() user: UserEntity, @Param('id', ParseIntPipe) id: number) {
    return this.efectivoService.getCuentasDetail(id, user);
  }

  @Auth()
  @Get('efectivo-encabezado')
  async getEfectivoEncabezado(@User() user: UserEntity){ 
    return this.efectivoService.getEfectivoEncabezado(user);
  }
}
