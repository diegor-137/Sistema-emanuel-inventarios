import { Body, Controller, Post, Put, ParseIntPipe, Param } from '@nestjs/common';
import { CommonController } from '../../common/controller/common.controller';
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { EditProveedorDto } from './dto';

@Controller('proveedor')
export class ProveedorController extends CommonController (ProveedorService) {

    constructor(private readonly proveedorService:ProveedorService){
        super()
    }

    @Post()
    async CreateOne(
        @Body() dto:CreateProveedorDto
    ){
        return await this.proveedorService.createOne(dto)
    }

    @Put(':id')
    async editOne(
        @Param('id',ParseIntPipe) id:number,
        @Body() dto:EditProveedorDto
    ){
        return await this.proveedorService.editOne(id,dto)
    }
}
