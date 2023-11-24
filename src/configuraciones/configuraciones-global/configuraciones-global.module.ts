import { Module, forwardRef } from '@nestjs/common';
import { ConfiguracionesGlobalService } from './configuraciones-global.service';
import { ConfiguracionesGlobalController } from './configuraciones-global.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfiguracionesGlobal } from './entities/configuraciones-global.entity';
import { CobroModule } from 'src/finanzas/cobro/cobro.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([ConfiguracionesGlobal]),
    forwardRef(() => CobroModule)   
  ],
  controllers: [ConfiguracionesGlobalController],
  providers: [ConfiguracionesGlobalService],
  exports: [ConfiguracionesGlobalService]
})
export class ConfiguracionesGlobalModule {}
