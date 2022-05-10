import { Body, Controller, Param, Post, Put, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonController } from '../../common/controller/common.controller';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { EditClienteDto } from './dto/edit-cliente.dto';

@ApiTags('Cliente endPoints')
@Controller('cliente')
export class ClienteController extends CommonController(ClienteService){
    constructor(private readonly clienteService:ClienteService){super()}

    @Post()
    async create(@Body() dto:CreateClienteDto){
        return await this.clienteService.CreateOne(dto)
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id:number, 
        @Body() dto:EditClienteDto){
        return await this.clienteService.EditOne(id,dto)
    }
}
