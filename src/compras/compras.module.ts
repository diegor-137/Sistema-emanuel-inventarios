import { Module } from '@nestjs/common';
import { ProveedorModule } from './proveedor/proveedor.module';
import { CompraModule } from './compra/compra.module';
import { PedidoModule } from './pedido/pedido.module';

@Module({
  imports: [ProveedorModule, CompraModule, PedidoModule]
})
export class ComprasModule {}
