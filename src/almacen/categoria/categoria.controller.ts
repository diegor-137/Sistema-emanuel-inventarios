import { Body, Controller, Param, Post, Put, ParseIntPipe, Get, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CategoriaService } from './categoria.service';
import { CategoriaDto } from './dtos/categoria.dto';

@ApiTags('Categoria endPoints')
@Controller('categoria')
export class CategoriaController{
    constructor( private readonly categoriaService : CategoriaService ){}

    @Auth()
    @Get()
    async findAll(){
        return await this.categoriaService.findAll()
    }

    @Auth()
    @Get(':id')
    async findById(@Param('id',ParseIntPipe) id:number){
        return await this.categoriaService.findById(id)     
    }

    @Auth()
    @Post()
    async CreateOne(
        @Body() dto:CategoriaDto)
        {
            return await this.categoriaService.createOne(dto)
        }

    @Auth()
    @Put(':id')
    async editOne(
        @Param('id',ParseIntPipe) id:number,
        @Body() dto:CategoriaDto)
        {
            return await this.categoriaService.editOne(id,dto)
        }

    @Auth()
    @Delete(':id')
    async deleteById(@Param('id',ParseIntPipe) id:number){
        return await this.categoriaService.deleteById(id)
    }
}
