import { Body, Controller, Get, Param, Post, ParseIntPipe } from '@nestjs/common';
import { CommonController } from 'src/common/controller/common.controller';

import { CompraService } from './compra.service';
import { CreateCompraDto } from './dto/create-compra.dto';

@Controller('compra')
export class CompraController extends CommonController(CompraService) {
    constructor(private readonly compraService: CompraService) {super()}
    @Post()
    async createOne(
        @Body() dto:CreateCompraDto
    ){
        return await this.compraService.createOne(dto)
    }

    @Get("encontrar/:id")
    async findByIdCompra(
        @Param ('id',ParseIntPipe) id:number
    ){
        return await this.compraService.FindOne_Compra(id)
    }

    @Get("encontrar")
    async findManyCompra(){
        return await this.compraService.FindMany_Compra()
    }
}
