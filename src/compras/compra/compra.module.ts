import { Module } from '@nestjs/common';
import { CompraService } from './compra.service';
import { CompraController } from './compra.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Compra } from './entity/compra.entity';
import { DetalleCompra } from './entity/detalle-compra.entity';
import { ProductoModule } from '../../almacen/producto/producto.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Compra,DetalleCompra]),
    ProductoModule
  ],
  providers: [CompraService],
  controllers: [CompraController]
})
export class CompraModule {}
