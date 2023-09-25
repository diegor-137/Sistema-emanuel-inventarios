import { Module, forwardRef } from '@nestjs/common';
import { InventarioReportService } from './inventario-report.service';
import { InventarioReportController } from './inventario-report.controller';
import { ProductoModule } from 'src/almacen/producto/producto.module';

@Module({
    imports:[
    forwardRef(()=>ProductoModule),
  ],
  controllers: [InventarioReportController],
  providers: [InventarioReportService]
})
export class InventarioReportModule {}
