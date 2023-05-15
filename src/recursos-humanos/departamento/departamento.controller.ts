import { Controller, Param, Put, ParseIntPipe, Body, Post, Delete, Get} from '@nestjs/common';
import { EditDepartamentoDto } from './dto';
import { DepartamentoService } from './departamento.service';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';

@ApiTags('Departamento endPoints')
@Controller('departamento')
export class DepartamentoController{

    constructor(private readonly departamentoService:DepartamentoService){}

    @Auth()
    @Get()
    async findAll(){
        return await this.departamentoService.findAll()
    }

    @Auth()
    @Get(':id')
    async findById(@Param('id',ParseIntPipe) id:number){
        return await this.departamentoService.findById(id)     
    }

    @Auth()
    @Post()
    async CreateOne(
        @Body() dto:CreateDepartamentoDto)
        {
            return await this.departamentoService.createOne(dto)
        }

    @Auth()
    @Put(':id')
    async editOne(
        @Param('id',ParseIntPipe) id:number,
        @Body() dto:EditDepartamentoDto)
        {
            return await this.departamentoService.editOne(id,dto)
        }

    @Auth()
    @Delete(':id')
    async deleteById(@Param('id',ParseIntPipe) id:number){
        return await this.departamentoService.deleteById(id)
    }

}
