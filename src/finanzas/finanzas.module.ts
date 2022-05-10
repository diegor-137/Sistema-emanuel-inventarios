import { Module } from '@nestjs/common';
import { CobroModule } from './cobro/cobro.module';
import { CajaModule } from './caja/caja.module';

@Module({
  imports: [CobroModule, CajaModule]
})
export class FinanzasModule {}
