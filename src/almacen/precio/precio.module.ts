import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Costo } from './entities/costo.entity';
import { Precio } from './entities/precio.entity';
import { PrecioController } from './precio.controller';
import { CostoService } from './services/costo.service';
import { PrecioService } from './services/precio.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Costo,Precio])
  ],
  controllers: [PrecioController],
  providers: [PrecioService, CostoService],
  exports:[PrecioService,CostoService]
})
export class PrecioModule {}
