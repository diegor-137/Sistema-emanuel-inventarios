import { Body, Controller, Param, Post, Put, ParseIntPipe, Req, Get, Header} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonController } from '../../common/controller/common.controller';
import { CreatePuestoDto, EditPuestoDto } from './dto';
import { PuestoService } from './puesto.service';

@ApiTags('Puesto endPoints')
@Controller('puesto')
export class PuestoController extends CommonController(PuestoService){

    constructor(private readonly puestoService:PuestoService){super()}

    @Post()
    async CreateOne(
        @Body() dto:CreatePuestoDto
    )
    {
        return await this.puestoService.createOne(dto)
    }

    @Put(':id')
    async EditOne(
        @Param('id',ParseIntPipe) id:number,
        @Body() dto:EditPuestoDto 
    ){
        return await this.puestoService.editOne(id,dto)
    }

    @Get("encontrar")
    async FindAllPuesto(){
        return await this.puestoService.findMany_Puesto()
    }

    @Get("encontrar/:id")
    async FindByIdPuesto(
        @Param('id',ParseIntPipe) id:number
    ){
        return await this.puestoService.findOne_Puesto(id)
    }

/*     @Get('nombre/:nombre?')
    async findByNombre(
        @Param('nombre') nombre:string
    ){
        return await this.puestoService.findByNombre(nombre)
    } */

}
