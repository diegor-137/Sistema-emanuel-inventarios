import { Controller, Post, Body, Put, Param, ParseIntPipe, Get, Delete, Query } from '@nestjs/common';
import { CommonController } from '../../common/controller/common.controller';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { EditPedidoDto } from './dto/edit-pedido.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';

@ApiTags('Pedido endPoints')
@Controller('pedido')
export class PedidoController{
    constructor(private readonly pedidoService:PedidoService){}

    @Auth()
    @Get()
    async findAll(@Query() query: { start: Date, end:Date},
                    @User() user:UserEntity){
        return await this.pedidoService.findAll(query.start,query.end,user)
    }

    @Auth()
    @Get(':id')
    async findById(@Param('id',ParseIntPipe) id:number){
        return await this.pedidoService.findById(id)
    } 

    @Auth()
    @Post()
    async createOne(
        @Body() dto:CreatePedidoDto,
        @User() user: UserEntity
    ){
        dto.empleado = user.empleado
        dto.sucursal = user.empleado.sucursal
        return await this.pedidoService.createOne(dto)
    }

    @Auth()
    @Put(':id')
    async editOne(
        @Param('id',ParseIntPipe) id:number,
        @Body() dto:EditPedidoDto
    ){
        return await this.pedidoService.editOne(id,dto)
    }

    @Auth()
    @Delete(':id')
    async deleteById(@Param('id',ParseIntPipe) id:number){
        return await this.pedidoService.deleteById(id)
    }
}