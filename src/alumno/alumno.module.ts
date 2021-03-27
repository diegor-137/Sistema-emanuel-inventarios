import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumno } from './entity/alumno.entity';
import { AlumnoService } from './alumno.service';
import { AlumnoController } from './alumno.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alumno])
  ], 
  controllers: [AlumnoController],
  providers: [AlumnoService],
  exports: [AlumnoService] 
})
export class AlumnoModule {}
