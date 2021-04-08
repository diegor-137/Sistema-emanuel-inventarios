import { Module } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { EmpleadoController } from './empleado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from './entity/empleado.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Empleado])
  ],
  providers: [EmpleadoService],
  controllers: [EmpleadoController]
})
export class EmpleadoModule {}
