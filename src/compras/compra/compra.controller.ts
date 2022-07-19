import { Body, Controller, Get, Param, Post, ParseIntPipe, Put } from '@nestjs/common';
import { CommonController } from 'src/common/controller/common.controller';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';


import { CompraService } from './compra.service';
import { CreateCompraDto } from './dto/create-compra.dto';

@ApiTags('Compra endPoints')
@Controller('compra')
export class CompraController extends CommonController(CompraService) {
    constructor(private readonly compraService: CompraService) {super()}
    @Auth()
    @Post()
    async createOne(
        @Body() dto:CreateCompraDto,
        @User() user: UserEntity
    ){
        dto.empleado = user.empleado
        dto.sucursal = user.empleado.sucursal
        return await this.compraService.createOne(dto)
    }

    @Get("encontrar/:id")
    async findByIdCompra(
        @Param ('id',ParseIntPipe) id:number
    ){
        return await this.compraService.FindOne_Compra(id)
    }

    @Get("encontrar")
    async findManyCompra(){
        return await this.compraService.FindMany_Compra()
    }

    @Put(':id')
    async editOne(@Param('id',ParseIntPipe)id:number,
                  @Body() dto:CreateCompraDto){
        return this.compraService.editOne(id,dto)
    }

}
