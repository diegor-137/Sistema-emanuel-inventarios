import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sucursal } from './entity/sucursal.entity';
import { SucursalController } from './sucursal.controller';
import { SucursalService } from './sucursal.service';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports:[
    forwardRef(() => FilesModule),
    TypeOrmModule.forFeature([Sucursal])
  ],
  controllers: [SucursalController],
  providers: [SucursalService]
})
export class SucursalModule {}
