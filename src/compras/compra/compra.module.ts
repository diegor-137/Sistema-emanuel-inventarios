import { Module } from '@nestjs/common';
import { CompraController } from './compra.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Compra } from './entity/compra.entity';
import { DetalleCompra } from './entity/detalle-compra.entity';
import { ProductoModule } from '../../almacen/producto/producto.module';
import { ExistenciaCompraService } from './services/existencia-compra.service';
import { CompraService } from './services/compra.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Compra,DetalleCompra]),
    ProductoModule
  ],
  providers: [CompraService, ExistenciaCompraService],
  controllers: [CompraController]
})
export class CompraModule {}
