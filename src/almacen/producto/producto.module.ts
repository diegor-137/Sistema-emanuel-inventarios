import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { Foto } from './entities/foto.entity';
import { Precio } from './entities/precio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Producto, Foto, Precio])
  ],
  controllers: [ProductoController],
  providers: [ProductoService]
})
export class ProductoModule {}
