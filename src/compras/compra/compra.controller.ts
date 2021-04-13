import { Body, Controller, Post } from '@nestjs/common';
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
}
