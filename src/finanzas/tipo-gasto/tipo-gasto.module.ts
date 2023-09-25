import { Module } from '@nestjs/common';
import { TipoGastoService } from './tipo-gasto.service';
import { TipoGastoController } from './tipo-gasto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoGasto } from './entities/tipo-gasto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoGasto])
  ],
  controllers: [TipoGastoController],
  providers: [TipoGastoService]
})
export class TipoGastoModule {}
