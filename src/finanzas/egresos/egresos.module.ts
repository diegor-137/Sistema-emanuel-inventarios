import { forwardRef, Module } from '@nestjs/common';
import { EgresosService } from './egresos.service';
import { EgresosController } from './egresos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Egreso } from './entities/egreso.entity';
import { MovimientoCajaModule } from '../movimiento-caja/movimiento-caja.module';
import { CajaModule } from '../caja/caja.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    forwardRef(() => MovimientoCajaModule),
    forwardRef(()=>CajaModule),
    forwardRef(()=>AuthModule),
    TypeOrmModule.forFeature([Egreso])
  ],
  controllers: [EgresosController],
  providers: [EgresosService], 
  exports: [EgresosService]
})
export class EgresosModule {}
