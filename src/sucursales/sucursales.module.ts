import { Module } from '@nestjs/common';
import { RegionController } from './region/region.controller';
import { RegionModule } from './region/region.module';

@Module({
  imports: [RegionModule]
})
export class SucursalesModule {}
