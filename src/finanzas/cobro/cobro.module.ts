import { forwardRef, Module } from '@nestjs/common';
import { CobroService } from './cobro.service';
import { CobroController } from './cobro.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cobro } from './entities/cobro.entity';
import { DetalleCobro } from './entities/detalle-cobro';
import { VentaModule } from 'src/ventas/venta/venta.module';
import { CobroGateway } from './cobro.gateway';
import { MovimientoCajaModule } from '../movimiento-caja/movimiento-caja.module';
import { CajaModule } from '../caja/caja.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Cobro, DetalleCobro]),
    VentaModule,
    MovimientoCajaModule,
    forwardRef(() => CajaModule),
  ],
  controllers: [CobroController],
  providers: [CobroService, CobroGateway],
  exports: [CobroService]
})
export class CobroModule {}
