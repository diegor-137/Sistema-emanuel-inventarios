import { Controller, Get, Post, Body, Param, Put, UseInterceptors, ParseIntPipe, Res, UploadedFiles, HttpException, HttpStatus, Request } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CommonController } from '../../common/controller/common.controller';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FotoDto } from './dto/foto.dto';
import { storage } from './const/product-constant';


@Controller('producto')
export class ProductoController extends CommonController(ProductoService){
  constructor(private readonly productoService: ProductoService) {super()}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 5, storage))
  async uploadFiles( @UploadedFiles() files: Express.Multer.File[], @Body() producto: CreateProductoDto) {
    return await this.productoService.uploads(files, producto);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('files', 5))
  async update(@UploadedFiles() files: Express.Multer.File,@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productoService.update(+id, updateProductoDto);
  }



  @Get('images/:id')
  async productImage(@Param('id', ParseIntPipe) idProduc: number, @Body() foto:FotoDto, @Res() res:any){  
    return await this.productoService.productImage(idProduc, foto,res);        
  }
}

/* @Post('upload/:id')
@UseInterceptors(FileInterceptor('file', storage))
async uploadFile(@UploadedFile() file: Express.Multer.File , @Param('id', ParseIntPipe) id: number){
    return this.productoService.update(id, {foto: file.filename});

    //return {imagePath : file.filename}
}

@Get('product-image/:id')
  async findProfileImage(@Param('id', ParseIntPipe) id: number, @Res() res){
      const producto = await this.productoService.findById(id)
      
      return (res.sendFile(join(process.cwd(), 'uploads/productImages/' + producto.foto)));
} */