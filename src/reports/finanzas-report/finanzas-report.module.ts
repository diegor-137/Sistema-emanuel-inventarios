import { Module } from '@nestjs/common';
import { FinanzasReportService } from './finanzas-report.service';
import { FinanzasReportController } from './finanzas-report.controller';
import { VentaModule } from 'src/ventas/venta/venta.module';

@Module({
  imports: [
    VentaModule
  ],
  controllers: [FinanzasReportController],
  providers: [FinanzasReportService]
})
export class FinanzasReportModule {}
