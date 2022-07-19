import { Module } from '@nestjs/common';
import { TipoCobroService } from './tipo-cobro.service';
import { TipoCobroController } from './tipo-cobro.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoCobro } from './entities/tipo-cobro.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TipoCobro])
  ],
  controllers: [TipoCobroController],
  providers: [TipoCobroService]
})
export class TipoCobroModule {}
