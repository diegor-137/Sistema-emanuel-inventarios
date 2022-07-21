import { Module, forwardRef } from '@nestjs/common';
import { IngresosService } from './ingresos.service';
import { IngresosController } from './ingresos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingreso } from './entities/ingreso.entity';
import { CajaModule } from '../caja/caja.module';

@Module({
  imports:[
    forwardRef(()=>CajaModule),
    TypeOrmModule.forFeature([Ingreso])
  ],
  controllers: [IngresosController],
  providers: [IngresosService], 
  exports: [IngresosService]
})
export class IngresosModule {}
