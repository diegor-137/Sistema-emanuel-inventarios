import { Controller, Param, Put, ParseIntPipe, Body, Post, Get } from '@nestjs/common';
import { EditDepartamentoDto } from './dto';
import { DepartamentoService } from './departamento.service';
import { CommonController } from 'src/common/controller/common.controller';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';

@Controller('departamento')
export class DepartamentoController extends CommonController(DepartamentoService){

    constructor(private readonly departamentoService:DepartamentoService){super()}

    @Post()
    async CreateOne(
        @Body() dto:CreateDepartamentoDto)
        {
            return await this.departamentoService.createOne(dto)
        }

    @Put(':id')
    async editOne(
        @Param('id',ParseIntPipe) id:number,
        @Body() dto:EditDepartamentoDto)
        {
            return await this.departamentoService.editOne(id,dto)
        }

/*     @Get('nombre/:nombre?')
    async findByNombre(
        @Param('nombre') nombre:string
    ){
        return await this.departamentoService.findByNombre(nombre)
    } */

}
