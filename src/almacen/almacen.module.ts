import { Module } from '@nestjs/common';
import { CategoriaModule } from './categoria/categoria.module';
import { MarcaModule } from './marca/marca.module';
import { ProductoModule } from './producto/producto.module';
import { TipoPrecioModule } from './tipo-precio/tipo-precio.module';
import { InventarioModule } from './inventario/inventario.module';
import { PrecioModule } from './precio/precio.module';
import { KardexModule } from './kardex/kardex.module';

@Module({
  imports: [
    CategoriaModule, 
    MarcaModule, 
    ProductoModule, 
    TipoPrecioModule, 
    InventarioModule, PrecioModule, KardexModule]
})
export class AlmacenModule {}
