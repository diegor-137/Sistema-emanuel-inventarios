
import { Body, Controller, Get, Param, Post, ParseIntPipe, Put } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { CommonController } from '../../common/controller/common.controller';
import { VentaService } from './venta.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';

@ApiTags('Venta endPoints')
@Controller('venta')
export class VentaController extends CommonController(VentaService){

    constructor(private readonly ventaService:VentaService){super()}
    @Auth()
    @Post()
    async CreateOne(
        @Body() dto:CreateVentaDto,
        @User() user: UserEntity
    ){
        dto.empleado = user.empleado
        dto.sucursal = user.empleado.sucursal
        return await this.ventaService.CreateOne(dto)
    }

    @Put(':id')
    async editOne(
        @Param('id',ParseIntPipe) id:number,
        @Body() dto:CreateVentaDto)
        {
            return await this.ventaService.editOne(id,dto)
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
