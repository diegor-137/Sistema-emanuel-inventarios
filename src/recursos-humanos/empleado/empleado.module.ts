import { Module } from '@nestjs/common';
import { EmpleadoService } from './services/empleado.service';
import { EmpleadoController } from './empleado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from './entity/empleado.entity';
import { HistorialEmpService } from './services/historial-emp.service';
import { historialEmp } from './entity/historial-emp.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Empleado,historialEmp])
  ],
  providers: [EmpleadoService,HistorialEmpService],
  controllers: [EmpleadoController],
  exports: [EmpleadoService]
})
export class EmpleadoModule {}
