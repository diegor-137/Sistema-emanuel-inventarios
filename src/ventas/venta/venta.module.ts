import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentaController } from './venta.controller';
import { VentaService } from './venta.service';
import { Venta } from './entity/venta.entity';
import { DetalleVenta } from './entity/detalle-venta.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Venta,DetalleVenta])
  ],
  controllers: [VentaController],
  providers: [VentaService]
})
export class VentaModule {}
