import { Module } from '@nestjs/common';
import { CuentasPorCobrarModule } from './cuentas-por-cobrar/cuentas-por-cobrar.module';
import { CuentaPorPagarModule } from './cuentas-por-pagar/cuenta-por-pagar.module';
import { CreditoClienteModule } from './credito-cliente/credito-cliente.module';
import { CreditoProveedorModule } from './credito-proveedor/credito-proveedor.module';

@Module({
    imports:[CuentaPorPagarModule, CuentasPorCobrarModule, CreditoClienteModule, CreditoProveedorModule]
})
export class CreditosModule {}
