<<<<<<< HEAD
import { Module, forwardRef } from '@nestjs/common';
import { CompraService } from './compra.service';
=======
import { Module } from '@nestjs/common';
>>>>>>> 34de35d63b5379a90ec65886837da6d76c32b55f
import { CompraController } from './compra.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Compra } from './entity/compra.entity';
import { DetalleCompra } from './entity/detalle-compra.entity';
import { ProductoModule } from '../../almacen/producto/producto.module';
<<<<<<< HEAD
import { CuentaPorPagarModule } from 'src/creditos/cuentas-por-pagar/cuenta-por-pagar.module';
import { CreditoProveedorModule } from 'src/creditos/credito-proveedor/credito-proveedor.module';
=======
import { ExistenciaCompraService } from './services/existencia-compra.service';
import { CompraService } from './services/compra.service';
>>>>>>> 34de35d63b5379a90ec65886837da6d76c32b55f

@Module({
  imports:[
    forwardRef(()=>CuentaPorPagarModule),
    TypeOrmModule.forFeature([Compra,DetalleCompra]),
    forwardRef(()=>ProductoModule),
    forwardRef(()=>CreditoProveedorModule)
  ],
  providers: [CompraService, ExistenciaCompraService],
  controllers: [CompraController]
})
export class CompraModule {}
