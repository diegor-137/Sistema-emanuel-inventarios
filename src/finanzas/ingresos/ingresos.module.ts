import { Module, forwardRef } from '@nestjs/common';
import { IngresosService } from './ingresos.service';
import { IngresosController } from './ingresos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingreso } from './entities/ingreso.entity';
import { CajaModule } from '../caja/caja.module';
import { AuthModule } from '../../auth/auth.module';
import { MovimientoCajaModule } from '../movimiento-caja/movimiento-caja.module';
import { EgresosModule } from '../egresos/egresos.module';

@Module({
  imports:[
    forwardRef(()=>CajaModule),
    forwardRef(()=>AuthModule),
    forwardRef(()=>MovimientoCajaModule),
    forwardRef(()=>EgresosModule),
    TypeOrmModule.forFeature([Ingreso])
  ],
  controllers: [IngresosController],
  providers: [IngresosService], 
  exports: [IngresosService]
})
export class IngresosModule {}
