import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoTransaccionService } from './tipo-transaccion.service';
import { CreatetipoTransaccionDto } from './dto/create-tipo-transaccion.dto';
import { UpdateTipoTransaccionDto } from './dto/update-tipo-transaccion.dto';


@Controller('tipo-transaccion')
export class TipoTransaccionController {
  constructor(private readonly tipoTransaccionService: TipoTransaccionService) {}

  @Post()
  async create(@Body() createTipoTransaccionDto: CreatetipoTransaccionDto) {
    return await this.tipoTransaccionService.create(createTipoTransaccionDto);
  }

  @Get()
  async findAll() {
    return await this.tipoTransaccionService.findAll();
  }
}
