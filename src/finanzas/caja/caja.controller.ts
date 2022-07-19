import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CajaService } from './caja.service';
import { CreateCajaDto } from './dto/create-caja.dto';


@Controller('caja')
export class CajaController {
  constructor(private readonly cajaService: CajaService) {}

  @Post()
  async create(@Body() createCajaDto: CreateCajaDto) {
    return await this.cajaService.create(createCajaDto);
  }

  @Get()
  async findAll() {
    return await this.cajaService.findAll();
  }

  @Get('cajeros')
  async cajeros() {
    return await this.cajaService.cajeros();
  }

  @Delete(':id')
  async update(@Param('id') id: number) {
    return this.cajaService.update(+id);
  }
}
