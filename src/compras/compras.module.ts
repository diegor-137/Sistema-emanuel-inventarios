import { Module } from '@nestjs/common';
import { ProveedorModule } from './proveedor/proveedor.module';
import { CompraModule } from './compra/compra.module';
import { PedidoModule } from './pedido/pedido.module';
import { PrecioModule } from 'src/almacen/precio/precio.module';

@Module({
  imports: [ProveedorModule, CompraModule, PedidoModule]
})
export class ComprasModule {}
