import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoCobroService } from './tipo-cobro.service';
import { CreateTipoCobroDto } from './dto/create-tipo-cobro.dto';
import { UpdateTipoCobroDto } from './dto/update-tipo-cobro.dto';

@Controller('tipo-cobro')
export class TipoCobroController {
  constructor(private readonly tipoCobroService: TipoCobroService) {}

  @Post()
  async create(@Body() createTipoCobroDto: CreateTipoCobroDto) {
    return await this.tipoCobroService.create(createTipoCobroDto);
  }

  @Get()
  async findAll() {
    return await this.tipoCobroService.findAll();
  }

  /** PENDIENTES **/

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoCobroService.findOne(+id);
  }

  /** PENDIENTES **/

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoCobroDto: UpdateTipoCobroDto) {
    return this.tipoCobroService.update(+id, updateTipoCobroDto);
  }

  /** PENDIENTES **/

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoCobroService.remove(+id);
  }
}
