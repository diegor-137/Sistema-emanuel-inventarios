import { Module } from '@nestjs/common';
import { CompraService } from './compra.service';
import { CompraController } from './compra.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Compra } from './entity/compra.entity';
import { DetalleCompra } from './entity/detalle-compra.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Compra,DetalleCompra])
  ],
  providers: [CompraService],
  controllers: [CompraController]
})
export class CompraModule {}
