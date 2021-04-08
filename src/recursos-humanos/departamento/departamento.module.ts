import { Module } from '@nestjs/common';
import { DepartamentoService } from './departamento.service';
import { DepartamentoController } from './departamento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Departamento } from './entity/departamento.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Departamento])
  ],
  providers: [DepartamentoService],
  controllers: [DepartamentoController]
})
export class DepartamentoModule {}
