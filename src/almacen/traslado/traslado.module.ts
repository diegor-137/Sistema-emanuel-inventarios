import { Module, forwardRef } from '@nestjs/common';
import { TrasladoService } from './traslado.service';
import { TrasladoController } from './traslado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Traslado } from './entities/traslado.entity';
import { DetalleTraslado } from './entities/detalle-traslado';
import { VentaModule } from 'src/ventas/venta/venta.module';

@Module({
  imports:[
    forwardRef(()=>VentaModule),
    TypeOrmModule.forFeature([Traslado,DetalleTraslado])
  ],
  controllers: [TrasladoController],
  providers: [TrasladoService]
})
export class TrasladoModule {}
