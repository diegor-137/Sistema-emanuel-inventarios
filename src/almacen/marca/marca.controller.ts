import { Controller, Post, Body, Param, Delete, Put, Get, ParseIntPipe } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { MarcaDto } from './dto/marca.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('Marca endPoints')
@Controller('marca')
export class MarcaController{
  constructor(private readonly marcaService: MarcaService){}

  @Auth()
  @Get()
  async findAll(){
    return await this.marcaService.findAll()
  }

  @Get('active')
  async findAllActive(){
    return await this.marcaService.findAllActive()
  }

  @Auth()
  @Get('uno/:id')
  async findById(@Param('id',ParseIntPipe) id:number){
    return await this.marcaService.findById(id)
  }

  @Auth()
  @Post()
  create(@Body() marca: MarcaDto) {
    return this.marcaService.createOne(marca);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() marca: MarcaDto) {
    return this.marcaService.editOne(+id, marca);
  }

  @Auth()
    @Delete(':id')
    async deleteById(@Param('id',ParseIntPipe) id:number){
        return await this.marcaService.deleteById(id)
    }

    @Auth()
    @Get('autocomplete/:nombre?')
    async findByName(
       @Param('nombre') nombre:string 
    ){
        return await this.marcaService.findByName(nombre)
    }
}
