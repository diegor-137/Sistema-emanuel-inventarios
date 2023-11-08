import { Module, forwardRef } from '@nestjs/common';
import { CuentasPorCobrarService } from './cuentas-por-cobrar.service';
import { CuentasPorCobrarController } from './cuentas-por-cobrar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuentaPorCobrarDetalle } from './entities/cuenta-por-cobrar-details.entity';
import { CuentaPorCobrar } from './entities/cuenta-por-cobrar.entity';
import { IngresosModule } from 'src/finanzas/ingresos/ingresos.module';
import { CajaModule } from 'src/finanzas/caja/caja.module';
import { MovimientoCajaModule } from 'src/finanzas/movimiento-caja/movimiento-caja.module';
import { CreditoClienteModule } from '../credito-cliente/credito-cliente.module';
import { CuentaBancariaModule } from 'src/finanzas/fondos/cuenta-bancaria/cuenta-bancaria.module';



@Module({
  imports: [
    TypeOrmModule.forFeature([CuentaPorCobrar, CuentaPorCobrarDetalle]),
    forwardRef(()=>MovimientoCajaModule),
    forwardRef(()=>CajaModule),
    forwardRef(()=>CreditoClienteModule),
    forwardRef(()=>CuentaBancariaModule)
  ],
  controllers: [CuentasPorCobrarController],
  providers: [CuentasPorCobrarService],
  exports: [CuentasPorCobrarService]
})
export class CuentasPorCobrarModule {}
