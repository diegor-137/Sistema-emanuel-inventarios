import { Module } from '@nestjs/common';
import { CobroModule } from './cobro/cobro.module';
import { CajaModule } from './caja/caja.module';
import { CorteCajaModule } from './corte-caja/corte-caja.module';
import { MovimientoCajaModule } from './movimiento-caja/movimiento-caja.module';
import { GastosModule } from './gastos/gastos.module';
import { IngresosModule } from './ingresos/ingresos.module';
import { EgresosModule } from './egresos/egresos.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CuentaBancariaModule } from './fondos/cuenta-bancaria/cuenta-bancaria.module';
import { BancosModule } from './fondos/bancos/bancos.module';
import { EfectivoModule } from './fondos/efectivo/efectivo.module';
import { TipoTransaccionModule } from './tipo-transaccion/tipo-transaccion.module';
import { TipoGastoModule } from './tipo-gasto/tipo-gasto.module';
import { PagoModule } from './pago/pago.module';

@Module({
  imports: [CobroModule, 
    CajaModule, 
    TipoTransaccionModule, 
    CorteCajaModule, 
    MovimientoCajaModule, 
    GastosModule, 
    IngresosModule, 
    EgresosModule, 
    TransactionsModule,
    CuentaBancariaModule,
    BancosModule,
    EfectivoModule,
    TipoGastoModule,
    PagoModule
  ],
  
})
export class FinanzasModule {}
