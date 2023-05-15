import { Module, forwardRef } from '@nestjs/common';
import { CreditoProveedorService } from './credito-proveedor.service';
import { CreditoProveedorController } from './credito-proveedor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditoProveedor } from './entities/credito-proveedor.entity';
import { CuentaPorPagarModule } from '../cuentas-por-pagar/cuenta-por-pagar.module';

@Module({
  imports: [
    forwardRef(()=>CuentaPorPagarModule),
    TypeOrmModule.forFeature([CreditoProveedor])
  ],
  controllers: [CreditoProveedorController],
  providers: [CreditoProveedorService], 
  exports: [CreditoProveedorService]
})
export class CreditoProveedorModule {}
