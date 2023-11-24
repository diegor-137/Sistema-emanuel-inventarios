
import { Body, Controller, Get, Param, Post, ParseIntPipe, Put, Delete, Query } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { CommonController } from '../../common/controller/common.controller';
import { VentaService } from './services/venta.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';

@ApiTags('Venta endPoints')
@Controller('venta')
export class VentaController{

    constructor(private readonly ventaService:VentaService){}
    
    @Auth()
    @Get()
    async FindAll(@Query() query: { start: Date, end:Date},
                  @User() user:UserEntity){
        return await this.ventaService.FindAll(query.start,query.end,user,true)
    }

    @Get(":id")
    async findById(
        @Param ('id',ParseIntPipe) id:number
    ){
        return await this.ventaService.findById(id)
    }
    
    @Auth()
    @Post()
    async CreateOne(
        @Body() dto:CreateVentaDto,
        @User() user: UserEntity
    ){
        dto.empleado = user.empleado
        dto.sucursal = user.empleado.sucursal
        return await this.ventaService.CreateOne(dto, user)
    }

    @Auth()
    @Put(':id')
    async editOne(
        @Param('id',ParseIntPipe) id:number,
        @Body() dto:CreateVentaDto)
        {
            return await this.ventaService.editOne(id,dto)
        }

    @Auth()
    @Delete(':id')
    async deleteById(@Param('id',ParseIntPipe) id:number){
        return await this.ventaService.deleteById(id)
    }
}
