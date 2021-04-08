import { Module } from '@nestjs/common';
import { DepartamentoModule } from './departamento/departamento.module';
import { PuestoModule } from './puesto/puesto.module';
import { EmpleadoModule } from './empleado/empleado.module';

@Module({
  imports: [
    DepartamentoModule, 
    PuestoModule, 
    EmpleadoModule]
})
export class RecursosHumanosModule {}
