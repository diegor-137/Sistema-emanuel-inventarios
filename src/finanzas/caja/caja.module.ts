import { forwardRef, Module } from '@nestjs/common';
import { CajaService } from './caja.service';
import { CajaController } from './caja.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Caja } from './entities/caja.entity';
import { EmpleadoModule } from 'src/recursos-humanos/empleado/empleado.module';
import { MovimientoCajaModule } from '../movimiento-caja/movimiento-caja.module';
import { CorteCajaModule } from '../corte-caja/corte-caja.module';
import { EfectivoModule } from '../fondos/efectivo/efectivo.module';

@Module({
  imports: [
    forwardRef(() => MovimientoCajaModule),
    forwardRef(() => CorteCajaModule),
    forwardRef(() => EfectivoModule),
    EmpleadoModule,
    TypeOrmModule.forFeature([Caja])
  ],
  controllers: [CajaController],
  providers: [CajaService], 
  exports: [CajaService]
})
export class CajaModule {}
