import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentaController } from './venta.controller';
import { VentaService } from './services/venta.service';
import { Venta } from './entity/venta.entity';
import { DetalleVenta } from './entity/detalle-venta.entity';
import { ProductoModule } from '../../almacen/producto/producto.module';
import { ExistenciaVentaService } from './services/existencia-venta.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Venta,DetalleVenta]),
    ProductoModule
  ],
  controllers: [VentaController],
  providers: [VentaService, ExistenciaVentaService], 
  exports: [VentaService]
})
export class VentaModule {}
