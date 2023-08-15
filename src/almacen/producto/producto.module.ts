import { Module } from '@nestjs/common';
import { ProductoService } from './services/producto.service';
import { ProductoController } from './producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Foto } from './entities/foto.entity';

import { Inventario } from './entities/inventario.entity';
import { InventarioService } from './services/inventario.service';
import { PrecioModule } from '../precio/precio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, Foto, Inventario]),
    PrecioModule,
  ],
  controllers: [ProductoController],
  providers: [ProductoService,InventarioService],
  exports:[InventarioService]
})
export class ProductoModule {}
