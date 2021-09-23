import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Foto } from './entities/foto.entity';
import { Precio } from './entities/precio.entity';
import { Inventario } from './entities/inventario.entity';
import { InventarioService } from './inventario.service';
import { PrecioService } from './precio.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, Foto, Precio, Inventario])
  ],
  controllers: [ProductoController],
  providers: [ProductoService,InventarioService,PrecioService],
  exports:[InventarioService,PrecioService]
})
export class ProductoModule {}
