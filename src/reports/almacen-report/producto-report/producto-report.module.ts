import { Module, forwardRef } from '@nestjs/common';
import { ProductoReportService } from './producto-report.service';
import { ProductoReportController } from './producto-report.controller';
import { ProductoModule } from 'src/almacen/producto/producto.module';

@Module({
  imports:[
    forwardRef(()=>ProductoModule),
  ],
  controllers: [ProductoReportController],
  providers: [ProductoReportService],
})
export class ProductoReportModule {}
