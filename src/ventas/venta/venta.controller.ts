import { Body, Controller, Get, Param, Post, ParseIntPipe } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { CommonController } from '../../common/controller/common.controller';
import { VentaService } from './venta.service';

@Controller('venta')
export class VentaController extends CommonController(VentaService){

    constructor(private readonly ventaService:VentaService){super()}

    @Post()
    async CreateOne(
        @Body() dto:CreateVentaDto
    ){
        return await this.ventaService.CreateOne(dto)
    }

    @Get("encontrar/:id")
    async findByIdVenta(
        @Param ('id',ParseIntPipe) id:number
    ){
        return await this.ventaService.FindOne_Venta(id)
    }

    @Get("encontrar")
    async findManyVenta(){
        return await this.ventaService.FindMany_Venta()
    }

}
