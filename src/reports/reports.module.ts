import { Module } from '@nestjs/common';
import { FinanzasReportModule } from './finanzas-report/finanzas-report.module';
import { ProductoReportModule } from './almacen-report/producto-report/producto-report.module';
import { ProductoModule } from 'src/almacen/producto/producto.module';
import { InventarioReportModule } from './almacen-report/inventario-report/inventario-report.module';
import { CompraReportModule } from './compras-report/compra-report/compra-report.module';
import { ProveedoresReportModule } from './compras-report/proveedores-report/proveedores-report.module';
import { VentasReportModule } from './ventas-report/ventas-report/ventas-report.module';
import { ClientesReportModule } from './ventas-report/clientes-report/clientes-report.module';

@Module({
  imports: [FinanzasReportModule, 
            ProductoReportModule, InventarioReportModule, CompraReportModule, ProveedoresReportModule, VentasReportModule, ClientesReportModule,
          ]
  
})
export class ReportsModule {}
