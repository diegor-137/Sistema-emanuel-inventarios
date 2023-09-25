import { Module, forwardRef } from '@nestjs/common';
import { CompraController } from './compra.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Compra } from './entity/compra.entity';
import { DetalleCompra } from './entity/detalle-compra.entity';
import { ProductoModule } from '../../almacen/producto/producto.module';
import { CuentaPorPagarModule } from 'src/creditos/cuentas-por-pagar/cuenta-por-pagar.module';
import { CreditoProveedorModule } from 'src/creditos/credito-proveedor/credito-proveedor.module';
import { ExistenciaCompraService } from './services/existencia-compra.service';
import { CompraService } from './services/compra.service';
import { PrecioModule } from 'src/almacen/precio/precio.module';
import { KardexModule } from 'src/almacen/kardex/kardex.module';
import { PagoModule } from 'src/finanzas/pago/pago.module';

@Module({
  imports:[
    forwardRef(()=>CuentaPorPagarModule),
    TypeOrmModule.forFeature([Compra,DetalleCompra]),
    forwardRef(()=>ProductoModule),
    forwardRef(()=>CreditoProveedorModule),
    forwardRef(()=>PagoModule),
    PrecioModule,
    KardexModule,
    
  ],
  controllers: [CompraController],
  providers: [CompraService, ExistenciaCompraService],
})
export class CompraModule {}
