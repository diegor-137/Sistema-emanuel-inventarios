import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentaController } from './venta.controller';
import { VentaService } from './venta.service';
import { Venta } from './entity/venta.entity';
import { DetalleVenta } from './entity/detalle-venta.entity';
import { ProductoModule } from '../../almacen/producto/producto.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Venta,DetalleVenta]),
    ProductoModule
  ],
  controllers: [VentaController],
  providers: [VentaService]
})
export class VentaModule {}
