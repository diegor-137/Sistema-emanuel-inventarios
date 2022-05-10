import { Controller, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { MarcaDto } from './dto/marca.dto';
import { CommonController } from '../../common/controller/common.controller';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Marca endPoints')
@Controller('marca')
export class MarcaController extends CommonController(MarcaService) {
  constructor(private readonly marcaService: MarcaService) {super()}

  @Post()
  create(@Body() marca: MarcaDto) {
    return this.marcaService.create(marca);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() marca: MarcaDto) {
    return this.marcaService.update(+id, marca);
  }
}
