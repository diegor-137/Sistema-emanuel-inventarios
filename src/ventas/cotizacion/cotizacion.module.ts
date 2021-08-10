import { Module } from '@nestjs/common';
import { CotizacionService } from './cotizacion.service';
import { CotizacionController } from './cotizacion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cotizacion } from './entity/cotizacion.entity';
import { DetalleCotizacion } from './entity/detalle-cotizacion.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Cotizacion,DetalleCotizacion])
  ],
  providers: [CotizacionService],
  controllers: [CotizacionController]
})
export class CotizacionModule {}
