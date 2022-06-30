import { Module, forwardRef } from '@nestjs/common';
import { MovimientoCajaService } from './movimiento-caja.service';
import { MovimientoCajaController } from './movimiento-caja.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientoCaja } from './entities/movimiento-caja.entity';
import { CajaModule } from '../caja/caja.module';

@Module({
  imports: [
    forwardRef(() => CajaModule),
    TypeOrmModule.forFeature([MovimientoCaja]),
  ],
  controllers: [MovimientoCajaController],
  providers: [MovimientoCajaService],
  exports: [MovimientoCajaService]
})
export class MovimientoCajaModule {}
