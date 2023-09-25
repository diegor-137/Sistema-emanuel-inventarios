import { Module, forwardRef } from '@nestjs/common';
import { PagoService } from './pago.service';
import { PagoController } from './pago.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { DetallePago } from './entities/detalle-pago';
import { EfectivoModule } from '../fondos/efectivo/efectivo.module';
import { CuentaBancariaModule } from '../fondos/cuenta-bancaria/cuenta-bancaria.module';

@Module({
  imports: [
    forwardRef(()=>EfectivoModule),
    forwardRef(()=>CuentaBancariaModule),
    TypeOrmModule.forFeature([Pago, DetallePago])
  ],
  controllers: [PagoController],
  providers: [PagoService],
  exports: [PagoService]
})
export class PagoModule {}
