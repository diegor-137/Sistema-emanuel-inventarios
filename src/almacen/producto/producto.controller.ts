import { Controller, Get, Post, Body, Param, Put, UseInterceptors, ParseIntPipe, Res, UploadedFiles, Delete} from '@nestjs/common';
import { ProductoService } from './services/producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CommonController } from '../../common/controller/common.controller';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FotoDto } from './dto/foto.dto';
import { storage } from './const/product-constant';
import { InventarioService } from './services/inventario.service';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { InventarioDto } from './dto/inventario.dto';


@ApiTags('Producto endPoints')
@Controller('producto')
export class ProductoController{
  constructor(private readonly productoService: ProductoService,
              private readonly inventarioService:InventarioService,
              ) {}

  @Auth()              
  @Get('productos')
  async products(@User() user: UserEntity){
    return this.productoService.findAll(user);
  }

  @Auth()
  @Get('uno/:id')
  async findById(@Param('id',ParseIntPipe) id:number){
    return await this.productoService.findById(id)
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files', 5, storage))
  async uploadFiles( @UploadedFiles() files: Express.Multer.File[], 
                     @Body() producto: CreateProductoDto, 
                     @User() user:UserEntity) {
    return await this.productoService.createOne(files,producto);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('files', 5))
  async update(@UploadedFiles() files: Express.Multer.File,@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productoService.editOne(+id, updateProductoDto);
  }

  @Get('images/:id')
  async productImage(@Param('id', ParseIntPipe) idProduc: number, @Body() foto:FotoDto, @Res() res:any){  
    return await this.productoService.productImage(idProduc, foto,res);        
  }

  @Auth()
  @Delete(':id')
  async deleteById(@Param('id',ParseIntPipe) id:number){
      return await this.productoService.deleteById(id)
  }

    //Para generar consultas de los productos y de su inventario
    @Auth()
    @Get('transacciones')
    async productoVenta(@User() user: UserEntity){
      return this.productoService.prodPorSucursal(user);
    }
    @Auth()
    @Get('transaccionesCompras')
    async productoCompra(@User() user: UserEntity){
      return this.productoService.prodPorSucursalCompra(user);
    }
  
    //Para el modulo Inventario
    @Auth()
    @Get('inventario')
    async getInventario(@User() user: UserEntity){
      return this.inventarioService.prodPorSucursal(user);
    }

    //controlador para validar que se tenga existencia a la hora de hacer la venta  
    @Auth()
    @Get('inventario/:id')
    async Validador(@User() user: UserEntity,
                    @Param('id',ParseIntPipe) id:number){
      return this.inventarioService.getProductoSucursal(user,id);
    }

    //Controlador para ver la existencia de un producto en todas las sucursales
    @Get('inventarioTotalProd/:id')
    async getInventarioProducto(@Param('id',ParseIntPipe) id:number){
      return this.inventarioService.getInventarioTotalProducto(id)
    }

    @Put('inventario/:id')
   async updateInventario(
    @Param('id',ParseIntPipe) id:number,
    @Body() dto:InventarioDto
   ){
     return this.inventarioService.editOne(id,dto)
   }


   //temporal
//    @Get('costosprevios')
//    async findAl(){
//     return this.costoService.findAll()
//    }
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