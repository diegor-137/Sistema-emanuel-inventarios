import { forwardRef, Module } from '@nestjs/common';
import { CorteCajaService } from './corte-caja.service';
import { CorteCajaController } from './corte-caja.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorteCaja } from './entities/corte-caja.entity';
import { CobroModule } from '../cobro/cobro.module';
import { CorteCajaDetalle } from './entities/corte-caja-detalle';
import { MovimientoCajaModule } from '../movimiento-caja/movimiento-caja.module';
import { CajaModule } from '../caja/caja.module';
import { AuthModule } from '../../auth/auth.module';
import { GastosModule } from '../gastos/gastos.module';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => CajaModule),    
    forwardRef(() => CobroModule),    
    forwardRef(() => MovimientoCajaModule),
    //forwardRef(()=>GastosModule),
    TypeOrmModule.forFeature([CorteCaja, CorteCajaDetalle])
  ],
  controllers: [CorteCajaController],
  providers: [CorteCajaService],
  exports: [CorteCajaService]
})
export class CorteCajaModule {}
