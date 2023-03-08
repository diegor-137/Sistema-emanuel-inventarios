import { Module } from '@nestjs/common';
import { ProductoService } from './services/producto.service';
import { ProductoController } from './producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Foto } from './entities/foto.entity';
import { Precio } from './entities/precio.entity';
import { Inventario } from './entities/inventario.entity';
import { InventarioService } from './services/inventario.service';
import { PrecioService } from './services/precio.service';
import { Costo } from './entities/costo.entity';
import { CostoService } from './services/costo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, Foto, Precio, Inventario, Costo])
  ],
  controllers: [ProductoController],
  providers: [ProductoService,InventarioService,PrecioService, CostoService],
  exports:[InventarioService,PrecioService]
})
export class ProductoModule {}
