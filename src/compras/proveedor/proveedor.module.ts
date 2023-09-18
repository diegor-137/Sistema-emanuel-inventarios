import { Module, forwardRef } from '@nestjs/common';
import { ProveedorService } from './proveedor.service';
import { ProveedorController } from './proveedor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proveedor } from './entity/proveedor.entity';
import { CreditoProveedorModule } from 'src/creditos/credito-proveedor/credito-proveedor.module';

@Module({
  imports:[
    forwardRef(() => CreditoProveedorModule),
    TypeOrmModule.forFeature([Proveedor])
  ],
  providers: [ProveedorService],
  controllers: [ProveedorController],
  exports:[ProveedorService]
})
export class ProveedorModule {}
