import { forwardRef, Module } from '@nestjs/common';
import { GastosService } from './gastos.service';
import { GastosController } from './gastos.controller';
import { Gasto } from './entities/gasto.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { CajaModule } from '../caja/caja.module';
import { MovimientoCajaModule } from '../movimiento-caja/movimiento-caja.module';
import { IngresosModule } from '../ingresos/ingresos.module';
import { FilesModule } from 'src/files/files.module';
import { EfectivoModule } from '../fondos/efectivo/efectivo.module';

@Module({
  imports:[
    AuthModule,
    forwardRef(()=>EfectivoModule),
    forwardRef(()=>IngresosModule),
    forwardRef(() => FilesModule),
    forwardRef(()=>CajaModule),
    forwardRef(()=>MovimientoCajaModule),
    TypeOrmModule.forFeature([Gasto]),
  ],
  controllers: [GastosController],
  providers: [GastosService],
  exports: [GastosService]
})
export class GastosModule {}
