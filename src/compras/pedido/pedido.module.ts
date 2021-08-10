import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pedido } from './entity/pedido-entity';
import { DetallePedido } from './entity/detalle-pedido.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Pedido,DetallePedido])
  ],
  providers: [PedidoService],
  controllers: [PedidoController]
})
export class PedidoModule {}
