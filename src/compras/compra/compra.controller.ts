import { Body, Controller, Post } from '@nestjs/common';
import { CreateCompraDto } from './dto/create-compra.dto';
import { CreateDetalleCompraDto } from './dto/create-detalle-compra.dto';

@Controller('compra')
export class CompraController {

    @Post()
    createOne(
        @Body() dto:CreateCompraDto
    ){
        return [dto]
    }
}
