import { forwardRef, Module } from '@nestjs/common';
import { EfectivoService } from './efectivo.service';
import { EfectivoController } from './efectivo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Efectivo } from './entities/efectivo.entity';
import { DetalleEfectivo } from './entities/detalle-efectivo';
import { CajaModule } from 'src/finanzas/caja/caja.module';

@Module({
  imports: [
        TypeOrmModule.forFeature([Efectivo, DetalleEfectivo]),
        forwardRef(() => CajaModule),
  ],
  controllers: [EfectivoController],
  providers: [EfectivoService],
  exports: [EfectivoService]
})
export class EfectivoModule {}
