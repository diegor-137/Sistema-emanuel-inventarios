import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { CommonController } from '../../common/controller/common.controller';
import { TipoPrecioDto } from './dto/tipo-precio.dto';
import { TipoPrecioService } from './tipo-precio.service';

@Controller('tipo-precio')
export class TipoPrecioController extends CommonController(TipoPrecioService) {

    constructor(private readonly tipoPrecioService : TipoPrecioService){super()}

    @Post()
    async create(@Body() tipo: TipoPrecioDto){
        return await this.tipoPrecioService.create(tipo);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() tipo: TipoPrecioDto) {
    return this.tipoPrecioService.update(+id, tipo);
  }
    

}
