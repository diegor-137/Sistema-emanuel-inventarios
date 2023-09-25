import { Module, forwardRef } from '@nestjs/common';
import { ProveedoresReportService } from './proveedores-report.service';
import { ProveedoresReportController } from './proveedores-report.controller';
import { ProveedorModule } from 'src/compras/proveedor/proveedor.module';

@Module({
    imports:[
    forwardRef(()=>ProveedorModule),
  ],
  controllers: [ProveedoresReportController],
  providers: [ProveedoresReportService]
})
export class ProveedoresReportModule {}
