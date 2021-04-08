import { Module } from '@nestjs/common';
import { ProveedorModule } from './proveedor/proveedor.module';
import { CompraModule } from './compra/compra.module';

@Module({
  imports: [ProveedorModule, CompraModule]
})
export class ComprasModule {}
