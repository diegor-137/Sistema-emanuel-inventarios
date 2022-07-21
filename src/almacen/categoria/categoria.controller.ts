import { Body, Controller, Param, Post, Put, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonController } from 'src/common/controller/common.controller';
import { CategoriaService } from './categoria.service';
import { CategoriaDto } from './dtos/categoria.dto';

@ApiTags('Categoria endPoints')
@Controller('categoria')
export class CategoriaController extends CommonController(CategoriaService) {
    constructor( private readonly categoriaService : CategoriaService ){super()}

    @Post()
    async save(@Body() categoria: CategoriaDto){
        return this.categoriaService.save(categoria)
    }

    @Put(':id')
    async editOne(@Param('id', ParseIntPipe) id: number,
                  @Body() categoria: CategoriaDto){
        return this.categoriaService.editOne(id, categoria);
    }
}
