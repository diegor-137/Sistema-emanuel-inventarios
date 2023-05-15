import { Module, forwardRef } from '@nestjs/common';
import { CreditoClienteService } from './credito-cliente.service';
import { CreditoClienteController } from './credito-cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditoCliente } from './entities/credito-cliente.entity';
import { CuentasPorCobrarModule } from '../cuentas-por-cobrar/cuentas-por-cobrar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CreditoCliente]),
    forwardRef(()=>CuentasPorCobrarModule)
  ],
  controllers: [CreditoClienteController],
  providers: [CreditoClienteService], 
  exports: [CreditoClienteService]
})
export class CreditoClienteModule {}
