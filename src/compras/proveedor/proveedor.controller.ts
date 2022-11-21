import { Body, Controller, Post, Put, ParseIntPipe, Param, Get, Delete } from '@nestjs/common';
import { CommonController } from '../../common/controller/common.controller';
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { EditProveedorDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('Proveedor endPoints')
@Controller('proveedor')
export class ProveedorController{

    constructor(private readonly proveedorService:ProveedorService){
    }

    @Auth()
    @Get()
    async findAll(){
        return await this.proveedorService.findAll()
    }

    @Auth()
    @Get('uno/:id')
    async findById(@Param('id',ParseIntPipe) id:number){
        return await this.proveedorService.findById(id)
    }

    @Auth()
    @Post()
    async CreateOne(
        @Body() dto:CreateProveedorDto
    ){
        return await this.proveedorService.createOne(dto)
    }

    @Auth()
    @Put(':id')
    async editOne(
        @Param('id',ParseIntPipe) id:number,
        @Body() dto:EditProveedorDto
    ){
        return await this.proveedorService.editOne(id,dto)
    }

    @Auth()
    @Delete(':id')
    async deleteById(@Param('id',ParseIntPipe) id:number){
        return await this.proveedorService.deleteById(id)
    }

    @Auth()
    @Get(':nombre?')
    async findByName(
      @Param('nombre') nombre:string
    ){
      return await this.proveedorService.findByName(nombre)
    }
}
