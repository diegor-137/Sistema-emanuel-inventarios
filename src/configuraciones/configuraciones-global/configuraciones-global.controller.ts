import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConfiguracionesGlobalService } from './configuraciones-global.service';
import { CreateConfiguracionesGlobalDto } from './dto/create-configuraciones-global.dto';
import { UpdateConfiguracionesGlobalDto } from './dto/update-configuraciones-global.dto';

@Controller('configuraciones-global')
export class ConfiguracionesGlobalController {
  constructor(private readonly configuracionesGlobalService: ConfiguracionesGlobalService) {}

  @Post()
  create(@Body() createConfiguracionesGlobalDto: CreateConfiguracionesGlobalDto[]) {
    return this.configuracionesGlobalService.create(createConfiguracionesGlobalDto);
  }

  @Get()
  async findAll() {
    return await this.configuracionesGlobalService.findAll();
  }

  @Get('permisions')
  async findPermissions(){
    return await this.configuracionesGlobalService.findPermissions();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.configuracionesGlobalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConfiguracionesGlobalDto: UpdateConfiguracionesGlobalDto) {
    return this.configuracionesGlobalService.update(+id, updateConfiguracionesGlobalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.configuracionesGlobalService.remove(+id);
  }
}
