import { Module } from '@nestjs/common';
import { PuestoService } from './puesto.service';
import { PuestoController } from './puesto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Puesto } from './entity/puesto.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Puesto])
  ],
  providers: [PuestoService],
  controllers: [PuestoController]
})
export class PuestoModule {}
