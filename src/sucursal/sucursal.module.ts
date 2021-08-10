import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SucursalController } from './sucursal.controller';
import { SucursalService } from './sucursal.service';
import { Sucursal } from './entity/sucursal.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Sucursal])
  ],
  controllers: [SucursalController],
  providers: [SucursalService]
})
export class SucursalModule {}
