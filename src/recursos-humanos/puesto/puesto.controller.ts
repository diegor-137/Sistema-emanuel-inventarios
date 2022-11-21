import { Body, Controller, Param, Post, Put, ParseIntPipe, Req, Get, Header, Delete} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CommonController } from '../../common/controller/common.controller';
import { CreatePuestoDto, EditPuestoDto } from './dto';
import { PuestoService } from './puesto.service';

@ApiTags('Puesto endPoints')
@Controller('puesto')
export class PuestoController{

    constructor(private readonly puestoService:PuestoService){}

    @Auth()
    @Get()
    async FindAll(){
        return await this.puestoService.findAll()
    }

    @Auth()
    @Get(":id")
    async FindById(
        @Param('id',ParseIntPipe) id:number
    ){
        return await this.puestoService.findById(id)
    }

    @Auth()
    @Post()
    async CreateOne(
        @Body() dto:CreatePuestoDto
    )
    {
        return await this.puestoService.createOne(dto)
    }

    @Auth()
    @Put(':id')
    async EditOne(
        @Param('id',ParseIntPipe) id:number,
        @Body() dto:EditPuestoDto 
    ){
        return await this.puestoService.editOne(id,dto)
    }

    @Auth()
    @Delete(':id')
    async deleteById(@Param('id',ParseIntPipe) id:number){
        return await this.puestoService.deleteById(id)
    }
}
