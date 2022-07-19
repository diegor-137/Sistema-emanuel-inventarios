import { forwardRef, Module } from '@nestjs/common';
import { GastosService } from './gastos.service';
import { GastosController } from './gastos.controller';
import { Gasto } from './entities/gasto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { CajaModule } from '../caja/caja.module';
import { MovimientoCajaModule } from '../movimiento-caja/movimiento-caja.module';

@Module({
  imports:[
    AuthModule,
    forwardRef(()=>CajaModule),
    MovimientoCajaModule,
    TypeOrmModule.forFeature([Gasto]),
  ],
  controllers: [GastosController],
  providers: [GastosService]
})
export class GastosModule {}
