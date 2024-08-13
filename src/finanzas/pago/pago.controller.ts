import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PagoService } from './pago.service';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';

@Controller('pago')
export class PagoController {
  constructor(private readonly pagoService: PagoService) {}

  @Auth()
  @Get()
  async findAll(@Query() query: { start: Date, end:Date, id:number }, @User() user: UserEntity) {
    return await this.pagoService.findAll(query.start, query.end, user.empleado.sucursal.id);
  }

  @Auth()
  @Get('detalle/:id')
  findCobro(@Param('id') id: string) {
    return this.pagoService.findPago(+id);
  }
}
