import { Module, forwardRef } from '@nestjs/common';
import { CompraReportService } from './compra-report.service';
import { CompraReportController } from './compra-report.controller';
import { CompraModule } from 'src/compras/compra/compra.module';

@Module({
      imports:[
    forwardRef(()=>CompraModule),
  ],
  controllers: [CompraReportController],
  providers: [CompraReportService]
})
export class CompraReportModule {}
