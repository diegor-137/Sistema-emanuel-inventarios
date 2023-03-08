import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonController } from 'src/common/controller/common.controller';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { EditSucursalDto } from './dto/edit-sucursal.dto';
import { SucursalService } from './sucursal.service';

@ApiTags('Sucursal endPoints')
@Controller('sucursal')
export class SucursalController extends CommonController(SucursalService){
    constructor(private readonly sucursalService:SucursalService){super()}

    @Post()
    async CreateOne(
        @Body() dto:CreateSucursalDto)
        {
            return await this.sucursalService.CreateOne(dto)
        }

    @Put(':id')
    async editOne(
        @Param('id',ParseIntPipe) id:number,
        @Body() dto:EditSucursalDto)
        {
            return await this.sucursalService.editOne(id,dto)
        }

    @Get('region')
    async findRegion(){
        return await this.sucursalService.findAllSucursal()
    }
}
