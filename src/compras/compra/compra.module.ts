import { Module, forwardRef } from '@nestjs/common';
import { CompraService } from './compra.service';
import { CompraController } from './compra.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Compra } from './entity/compra.entity';
import { DetalleCompra } from './entity/detalle-compra.entity';
import { ProductoModule } from '../../almacen/producto/producto.module';
import { CuentaPorPagarModule } from 'src/creditos/cuentas-por-pagar/cuenta-por-pagar.module';
import { CreditoProveedorModule } from 'src/creditos/credito-proveedor/credito-proveedor.module';

@Module({
  imports:[
    forwardRef(()=>CuentaPorPagarModule),
    TypeOrmModule.forFeature([Compra,DetalleCompra]),
    forwardRef(()=>ProductoModule),
    forwardRef(()=>CreditoProveedorModule)
  ],
  providers: [CompraService],
  controllers: [CompraController]
})
export class CompraModule {}
