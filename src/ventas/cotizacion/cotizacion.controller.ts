import { Body, Controller, Param, Post, Put, ParseIntPipe, Get, Query, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { CommonController } from '../../common/controller/common.controller';
import { CotizacionService } from './cotizacion.service';
import { CreateCotizacionDto } from './dto/create-cotizacion.dto';
import { EditCotizacionDto } from './dto/edit-cotizacion.dto';

@ApiTags('Cotizacion endPoints')
@Controller('cotizacion')
export class CotizacionController{
    constructor(private readonly cotizacionService:CotizacionService){}

    @Auth()
    @Get()
    async findAll(@Query() query: { start: Date, end:Date}){
        return await this.cotizacionService.findAll(query.start,query.end)
    }
    
    @Auth()
    @Get(':id')
    async findById(@Param('id',ParseIntPipe) id:number){
        return await this.cotizacionService.findById(id)
    }

    @Auth()
    @Post()
    async createOne(
        @Body() dto:CreateCotizacionDto,
        @User() user: UserEntity
    ){  
        dto.empleado = user.empleado
        dto.sucursal = user.empleado.sucursal
        return await this.cotizacionService.createOne(dto)
    }

    @Put(':id')
    async editOne(
        @Param('id',ParseIntPipe) id:number,
        @Body() dto:EditCotizacionDto
    ){
        return await this.cotizacionService.editOne(id,dto)
    }

    @Auth()
    @Delete(':id')
    async deleteById(@Param('id',ParseIntPipe) id:number){
        return await this.cotizacionService.deleteById(id)
    }
}
