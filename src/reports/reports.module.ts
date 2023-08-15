import { Module } from '@nestjs/common';
import { FinanzasReportModule } from './finanzas-report/finanzas-report.module';

@Module({
  imports: [FinanzasReportModule]
})
export class ReportsModule {}
