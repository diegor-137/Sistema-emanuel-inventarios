import { forwardRef, Module } from '@nestjs/common';
import { CobroService } from './services/cobro.service';
import { CobroController } from './cobro.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cobro } from './entities/cobro.entity';
import { DetalleCobro } from './entities/detalle-cobro';
import { VentaModule } from 'src/ventas/venta/venta.module';
import { CobroGateway } from './cobro.gateway';
import { MovimientoCajaModule } from '../movimiento-caja/movimiento-caja.module';
import { CajaModule } from '../caja/caja.module';
import { AuthModule } from 'src/auth/auth.module';
import { EgresosModule } from '../egresos/egresos.module';
import { CuentaBancariaModule } from '../fondos/cuenta-bancaria/cuenta-bancaria.module';
import { CobroConsultService } from './services/cobro-consult.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Cobro, DetalleCobro]),
    forwardRef(() => CuentaBancariaModule),    
    forwardRef(() => VentaModule),    
    forwardRef(()=> MovimientoCajaModule),
    forwardRef(() => CajaModule),
    forwardRef(() => EgresosModule),
  ],
  controllers: [CobroController],
  providers: [CobroService, CobroGateway, CobroConsultService],
  exports: [CobroService, CobroConsultService]
})
export class CobroModule {}
