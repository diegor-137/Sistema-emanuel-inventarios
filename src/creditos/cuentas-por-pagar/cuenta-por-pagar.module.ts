import { Module, forwardRef } from '@nestjs/common';
import { CuentaPorPagarService } from './cuenta-por-pagar.service';
import { CuentaPorPagarController } from './cuenta-por-pagar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentaPorPagar } from './entities/cuenta-por-pagar-entity';
import { CuentaPorPagarDetalle } from './entities/cuenta-por-pagar-details.entity';
import { CreditoProveedorModule } from '../credito-proveedor/credito-proveedor.module';

@Module({
  imports: [
    forwardRef(()=>CreditoProveedorModule),
    TypeOrmModule.forFeature([CuentaPorPagar, CuentaPorPagarDetalle]),
  ],
  controllers: [CuentaPorPagarController],
  providers: [CuentaPorPagarService],
  exports: [CuentaPorPagarService]
})
export class CuentaPorPagarModule {}
