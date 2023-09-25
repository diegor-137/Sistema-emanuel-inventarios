import { Module, forwardRef } from '@nestjs/common';
import { ClientesReportService } from './clientes-report.service';
import { ClientesReportController } from './clientes-report.controller';
import { ClienteModule } from 'src/ventas/cliente/cliente.module';
import { CuentasPorCobrarModule } from 'src/creditos/cuentas-por-cobrar/cuentas-por-cobrar.module';

@Module({
    imports:[
    forwardRef(() => ClienteModule),
    forwardRef(() => CuentasPorCobrarModule)
  ],
  controllers: [ClientesReportController],
  providers: [ClientesReportService]
})
export class ClientesReportModule {}
