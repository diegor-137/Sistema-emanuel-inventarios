import { Module } from '@nestjs/common';
import { RecepcionService } from './recepcion.service';
import { RecepcionController } from './recepcion.controller';

@Module({
  controllers: [RecepcionController],
  providers: [RecepcionService]
})
export class RecepcionModule {}
