import { Body, Controller, Post, Get } from '@nestjs/common';
import { CreatePrecioDto } from './dto/create-precio.dto';
import { CostoService } from './services/costo.service';
import { PrecioService } from './services/precio.service';

@Controller('precio')
export class PrecioController {
    constructor(private readonly costoService:CostoService,
                private readonly precioService:PrecioService){}

    @Get()
    async findAllPrecios(){
        return await this.precioService.findAll()
    }

    @Post()
    async createPrecio(
        @Body() dto:CreatePrecioDto
    ){
        return await this.precioService.CreateOne(dto)
    }

    @Post('costo')
    async createCosto(@Body() dto:any){
     return this.costoService.createOne(dto)
    }
}
