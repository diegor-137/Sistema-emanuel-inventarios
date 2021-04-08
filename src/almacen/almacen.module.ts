import { Module } from '@nestjs/common';
import { CategoriaModule } from './categoria/categoria.module';
import { MarcaModule } from './marca/marca.module';
import { ProductoModule } from './producto/producto.module';

@Module({
  imports: [
    CategoriaModule, 
    MarcaModule, 
    ProductoModule]
})
export class AlmacenModule {}
