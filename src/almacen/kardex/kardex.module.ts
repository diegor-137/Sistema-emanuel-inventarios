import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kardex } from './entity/kardex.entity';
import { KardexService } from './services/kardex.service';
import { KardexController } from './kardex.controller';

@Module({
    imports:[
        TypeOrmModule.forFeature([Kardex])
    ],
    providers: [KardexService],
    controllers: [KardexController],
    exports:[KardexService]
})
export class KardexModule {}
