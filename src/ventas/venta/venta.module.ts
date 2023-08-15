import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentaController } from './venta.controller';
import { VentaService } from './services/venta.service';
import { Venta } from './entity/venta.entity';
import { DetalleVenta } from './entity/detalle-venta.entity';
import { ProductoModule } from '../../almacen/producto/producto.module';
import { CuentasPorCobrarModule } from 'src/creditos/cuentas-por-cobrar/cuentas-por-cobrar.module';
import { CreditoClienteModule } from 'src/creditos/credito-cliente/credito-cliente.module';
import { ExistenciaVentaService } from './services/existencia-venta.service';

@Module({
  imports:[
    forwardRef(()=>CuentasPorCobrarModule),
    forwardRef(()=>CreditoClienteModule),
    TypeOrmModule.forFeature([Venta,DetalleVenta]),
    ProductoModule
  ],
  controllers: [VentaController],
  providers: [VentaService, ExistenciaVentaService], 
  exports: [VentaService, ExistenciaVentaService]
})
export class VentaModule {}
