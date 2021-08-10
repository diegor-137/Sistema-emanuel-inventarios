import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoPrecioController } from './tipo-precio.controller';
import { TipoPrecioService } from './tipo-precio.service';
import { TipoPrecio } from './entities/tipo-precio.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([TipoPrecio])
  ],
  controllers: [TipoPrecioController],
  providers: [TipoPrecioService]
})
export class TipoPrecioModule {}
