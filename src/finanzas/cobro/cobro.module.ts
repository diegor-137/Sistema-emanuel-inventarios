import { Module } from '@nestjs/common';
import { CobroService } from './cobro.service';
import { CobroController } from './cobro.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cobro } from './entities/cobro.entity';
import { DetalleCobro } from './entities/detalle-cobro';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cobro, DetalleCobro])
  ],
  controllers: [CobroController],
  providers: [CobroService]
})
export class CobroModule {}
