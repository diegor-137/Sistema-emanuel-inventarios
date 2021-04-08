import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';
import { Categoria } from './entity/categoria.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Categoria])
  ],
  controllers: [CategoriaController],
  providers: [CategoriaService]
})
export class CategoriaModule {}
