import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoTransaccion } from './entities/tipo-transaccion.entity';
import { TipoTransaccionController } from './tipo-transaccion.controller';
import { TipoTransaccionService } from './tipo-transaccion.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoTransaccion])
  ],
  controllers: [TipoTransaccionController],
  providers: [TipoTransaccionService]
})
export class TipoTransaccionModule {}
