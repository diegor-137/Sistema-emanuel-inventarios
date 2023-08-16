import { Module } from '@nestjs/common';
import { CobroModule } from './cobro/cobro.module';
import { CajaModule } from './caja/caja.module';
import { TipoCobroModule } from './tipo-cobro/tipo-cobro.module';
import { CorteCajaModule } from './corte-caja/corte-caja.module';
import { MovimientoCajaModule } from './movimiento-caja/movimiento-caja.module';
import { GastosModule } from './gastos/gastos.module';
import { IngresosModule } from './ingresos/ingresos.module';
import { EgresosModule } from './egresos/egresos.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CuentaBancariaModule } from './fondos/cuenta-bancaria/cuenta-bancaria.module';

@Module({
  imports: [CobroModule, 
    CajaModule, 
    TipoCobroModule, 
    CorteCajaModule, 
    MovimientoCajaModule, 
    GastosModule, 
    IngresosModule, 
    EgresosModule, 
    TransactionsModule,
    CuentaBancariaModule
  ],
  
})
export class FinanzasModule {}
