import { Body, Controller, Param, Post, Put, ParseIntPipe, Get, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CommonController } from '../../common/controller/common.controller';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { EditClienteDto } from './dto/edit-cliente.dto';

@ApiTags('Cliente endPoints')
@Controller('cliente')
export class ClienteController{
    constructor(private readonly clienteService:ClienteService){}

    @Auth()
    @Get()
    async findAll(){
        return await this.clienteService.findAll()
    }

    @Auth()
    @Get('uno/:id')
    async findById(@Param('id',ParseIntPipe) id:number){
        return await this.clienteService.findById(id)
    }

    @Auth()
    @Post()
    async create(@Body() dto:CreateClienteDto){
        return await this.clienteService.CreateOne(dto)
    }

    @Auth()
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id:number, 
        @Body() dto:EditClienteDto){
        return await this.clienteService.EditOne(id,dto)
    }

    @Auth()
    @Delete(':id')
    async deleteById(@Param('id',ParseIntPipe) id:number){
        return await this.clienteService.deleteById(id)
    }

    @Auth()
    @Get(':nombre?')
    async findByName(
      @Param('nombre') nombre:string
    ){
      return await this.clienteService.findByName(nombre)
    }
}
