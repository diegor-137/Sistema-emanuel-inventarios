import { Module } from '@nestjs/common';
import { VentaModule } from './venta/venta.module';
import { ClienteModule } from './cliente/cliente.module';
import { CotizacionModule } from './cotizacion/cotizacion.module';

@Module({
  imports: [VentaModule, ClienteModule, CotizacionModule]
})
export class VentasModule {}
