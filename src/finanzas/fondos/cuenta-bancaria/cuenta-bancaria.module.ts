import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CuentaBancaria } from './entities/cuenta-bancaria';
import { DetalleCuentaBancaria } from './entities/detalle-cuenta-bancaria';
import { CuentaBancariaController } from './cuenta-bancaria.controller';
import { CuentaBancariaService } from './cuenta-bancaria.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CuentaBancaria, DetalleCuentaBancaria]),
  ],
  controllers: [CuentaBancariaController],
  providers: [CuentaBancariaService],
  exports: [CuentaBancariaService]
})
export class CuentaBancariaModule {}
