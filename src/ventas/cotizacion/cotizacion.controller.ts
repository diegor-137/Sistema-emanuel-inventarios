import { Body, Controller, Param, Post, Put, ParseIntPipe, Get } from '@nestjs/common';
import { CommonController } from '../../common/controller/common.controller';
import { CotizacionService } from './cotizacion.service';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { EditCotizacionDto } from './dto/edit-cotizacion.dto';

@Controller('cotizacion')
export class CotizacionController extends CommonController(CotizacionService) {
    constructor(private readonly cotizacionService:CotizacionService){super()}

    @Post()
    async createOne(
        @Body() dto:CreateCotizacionDto
    ){
        return await this.cotizacionService.createOne(dto)
    }

    @Put(':id')
    async editOne(
        @Param('id',ParseIntPipe) id:number,
        @Body() dto:EditCotizacionDto
    ){
        return await this.cotizacionService.editOne(id,dto)
    }

    @Get("encontrar/:id")
    async findByIdCompra(
        @Param ('id',ParseIntPipe) id:number
    ){
        return await this.cotizacionService.findOne_Cotizacion(id)
    }

    @Get("encontrar")
    async FindManyCompra(){
        return await this.cotizacionService.findMany_Cotizacion()
    }
}
