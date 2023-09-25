import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditoClienteModule } from 'src/creditos/credito-cliente/credito-cliente.module';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';
import { Cliente } from './entity/cliente.entity';

@Module({
  imports:[
    forwardRef(() => CreditoClienteModule),
    TypeOrmModule.forFeature([Cliente])
  ],
  controllers: [ClienteController],
  providers: [ClienteService],
  exports:[ClienteService]
})
export class ClienteModule {}
