import { Module } from '@nestjs/common';
import { ConfiguracionesGlobalModule } from './configuraciones-global/configuraciones-global.module';

@Module({
  imports: [ConfiguracionesGlobalModule]
})
export class ConfiguracionesModule {}
