import { Body, Controller, Get, Param, Post, ParseIntPipe, Put, Delete, Query } from '@nestjs/common';
import { CommonController } from 'src/common/controller/common.controller';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';



import { CreateCompraDto } from './dto/create-compra.dto';
import { CompraService } from './services/compra.service';

@ApiTags('Compra endPoints')
@Controller('compra')
export class CompraController{
    constructor(private readonly compraService: CompraService){}
    
    @Auth()
    @Get()
    async findAll(@Query() query: { start: Date, end:Date},
                    @User() user:UserEntity){
        return await this.compraService.findAll(query.start,query.end,user,true)
    } 

    @Auth()
    @Get(':id')
    async findById(@Param('id',ParseIntPipe) id:number){
        return await this.compraService.findById(id)
    }

    @Auth()
    @Post()
    async createOne(
        @Body() dto:CreateCompraDto,
        @User() user: UserEntity
    ){
        dto.empleado = user.empleado
        dto.sucursal = user.empleado.sucursal
        //return console.log(dto.sucursal)
        return await this.compraService.createOne(dto)
    }

    @Auth()
    @Put(':id')
    async editOne(@Param('id',ParseIntPipe)id:number,
                  @Body() dto:CreateCompraDto){
        return this.compraService.editOne(id,dto)
    }

    @Auth()
    @Delete(':id')
    async deleteById(@Param('id',ParseIntPipe) id:number){
        return await this.compraService.deleteById(id)
    }
}