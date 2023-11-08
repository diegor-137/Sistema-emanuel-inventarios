import { Module } from '@nestjs/common';
import { ConfiguracionesGlobalService } from './configuraciones-global.service';
import { ConfiguracionesGlobalController } from './configuraciones-global.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfiguracionesGlobal } from './entities/configuraciones-global.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([ConfiguracionesGlobal])
  ],
  controllers: [ConfiguracionesGlobalController],
  providers: [ConfiguracionesGlobalService],
  exports: [ConfiguracionesGlobalService]
})
export class ConfiguracionesGlobalModule {}
