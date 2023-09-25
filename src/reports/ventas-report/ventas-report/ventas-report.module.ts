import { Module, forwardRef } from '@nestjs/common';
import { VentasReportService } from './ventas-report.service';
import { VentasReportController } from './ventas-report.controller';
import { VentaModule } from 'src/ventas/venta/venta.module';

@Module({
  imports:[
    forwardRef(()=>VentaModule),
  ],
  controllers: [VentasReportController],
  providers: [VentasReportService]
})
export class VentasReportModule {}
