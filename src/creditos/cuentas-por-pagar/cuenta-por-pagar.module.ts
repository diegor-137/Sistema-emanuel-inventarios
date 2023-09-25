import { Module, forwardRef } from '@nestjs/common';
import { CuentaPorPagarService } from './cuenta-por-pagar.service';
import { CuentaPorPagarController } from './cuenta-por-pagar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentaPorPagar } from './entities/cuenta-por-pagar-entity';
import { CuentaPorPagarDetalle } from './entities/cuenta-por-pagar-details.entity';
import { CreditoProveedorModule } from '../credito-proveedor/credito-proveedor.module';
import { EfectivoModule } from 'src/finanzas/fondos/efectivo/efectivo.module';
import { CuentaBancariaModule } from 'src/finanzas/fondos/cuenta-bancaria/cuenta-bancaria.module';

@Module({
  imports: [
    forwardRef(()=>CreditoProveedorModule),
    forwardRef(()=>EfectivoModule),
    forwardRef(()=>CuentaBancariaModule),
    TypeOrmModule.forFeature([CuentaPorPagar, CuentaPorPagarDetalle]),
  ],
  controllers: [CuentaPorPagarController],
  providers: [CuentaPorPagarService],
  exports: [CuentaPorPagarService]
})
export class CuentaPorPagarModule {}
