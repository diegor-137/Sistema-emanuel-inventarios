import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecepcionService } from './recepcion.service';
import { CreateRecepcionDto } from './dto/create-recepcion.dto';
import { UpdateRecepcionDto } from './dto/update-recepcion.dto';

@Controller('recepcion')
export class RecepcionController {
  constructor(private readonly recepcionService: RecepcionService) {}

  @Post()
  create(@Body() createRecepcionDto: CreateRecepcionDto) {
    return this.recepcionService.create(createRecepcionDto);
  }

  @Get()
  findAll() {
    return this.recepcionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recepcionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRecepcionDto: UpdateRecepcionDto) {
    return this.recepcionService.update(+id, updateRecepcionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recepcionService.remove(+id);
  }
}
