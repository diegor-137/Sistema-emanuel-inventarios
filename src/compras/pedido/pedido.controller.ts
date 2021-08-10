import { Controller, Post, Body, Put, Param, ParseIntPipe, Get } from '@nestjs/common';
import { CommonController } from '../../common/controller/common.controller';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { EditPedidoDto } from './dto/edit-pedido.dto';


@Controller('pedido')
export class PedidoController extends CommonController (PedidoService) {
    constructor(private readonly pedidoService:PedidoService){super()}

    @Post()
    async createOne(
        @Body() dto:CreatePedidoDto
    ){
        return await this.pedidoService.createOne(dto)
    }

    @Put(':id')
    async editOne(
        @Param('id',ParseIntPipe) id:number,
        @Body() dto:EditPedidoDto
    ){
        return await this.pedidoService.editOne(id,dto)
    }

    @Get("encontrar/:id")
    async findByIdCompra(
        @Param ('id',ParseIntPipe) id:number
    ){
        return await this.pedidoService.findOne_Pedido(id)
    }

    @Get("encontrar")
    async FindManyCompra(){
        return await this.pedidoService.findMany_Pedido()
    }

}
