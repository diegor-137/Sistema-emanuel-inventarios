import { Body, Controller, Param, Post, Put, Get, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonController } from '../../common/controller/common.controller';
import { TipoPrecioDto } from './dto/tipo-precio.dto';
import { TipoPrecioService } from './tipo-precio.service';

@ApiTags('tipo-precio endPoints')
@Controller('tipo-precio')
export class TipoPrecioController{


    constructor(private readonly tipoPrecioService : TipoPrecioService){}

    @Get()
     async findAll(){
      return await this.tipoPrecioService.findAll()
     }
     
     @Get('/findAllTrue')
     async findAllTrue(){
      return await this.tipoPrecioService.findAllTrue()
     }

     @Get(':id')
     async findById(@Param('id',ParseIntPipe) id:number){
      return await this.tipoPrecioService.findById(id)
     }

    @Post()
    async create(@Body() tipo: TipoPrecioDto){
        return await this.tipoPrecioService.createOne(tipo);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() tipo: TipoPrecioDto) {
    return this.tipoPrecioService.update(+id, tipo);
  }
  
  @Delete(':id')
  async deleteById(@Param('id',ParseIntPipe) id:number){
    return await (this.tipoPrecioService.delete(id))
  }

}
