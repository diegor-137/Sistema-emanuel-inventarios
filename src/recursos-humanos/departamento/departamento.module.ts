import { Module } from '@nestjs/common';
import { DepartamentoService } from './departamento.service';
import { DepartamentoController } from './departamento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departamento } from './entity/departamento.entity';
import { CompraSubscriber } from 'src/compras/compra/subscribers/existencia-compra.subscriber';

@Module({
  imports:[
    TypeOrmModule.forFeature([Departamento])
  ],
  providers: [DepartamentoService, CompraSubscriber],
  controllers: [DepartamentoController]
})
export class DepartamentoModule {}
