import { forwardRef, Module } from '@nestjs/common';
import { CorteCajaService } from './services/corte-caja.service';
import { CorteCajaController } from './corte-caja.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorteCaja } from './entities/corte-caja.entity';
import { CobroModule } from '../cobro/cobro.module';
import { CorteCajaDetalle } from './entities/corte-caja-detalle';
import { MovimientoCajaModule } from '../movimiento-caja/movimiento-caja.module';
import { CajaModule } from '../caja/caja.module';
import { AuthModule } from '../../auth/auth.module';
import { GastosModule } from '../gastos/gastos.module';
import { IngresosModule } from '../ingresos/ingresos.module';
import { EgresosModule } from '../egresos/egresos.module';
import { CuentasPorCobrarModule } from '../../creditos/cuentas-por-cobrar/cuentas-por-cobrar.module';
import { ConfiguracionesGlobalModule } from 'src/configuraciones/configuraciones-global/configuraciones-global.module';
import { EfectivoModule } from '../fondos/efectivo/efectivo.module';
import { CorteCajaConsultService } from './services/corte-caja-consult.service';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => CajaModule),    
    forwardRef(() => CobroModule),    
    forwardRef(() => MovimientoCajaModule),
    forwardRef(()=>GastosModule),
    forwardRef(()=>IngresosModule),
    forwardRef(()=>EgresosModule),
    forwardRef(()=>CuentasPorCobrarModule),
    forwardRef(()=>ConfiguracionesGlobalModule),
    forwardRef(()=>EfectivoModule),
    TypeOrmModule.forFeature([CorteCaja, CorteCajaDetalle])
  ],
  controllers: [CorteCajaController],
  providers: [CorteCajaService, CorteCajaConsultService],
  exports: [CorteCajaService, CorteCajaConsultService]
})
export class CorteCajaModule {}
