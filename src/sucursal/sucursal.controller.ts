import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommonController } from '../common/controller/common.controller';
import { SucursalService } from './sucursal.service';

@ApiTags('Sucursal endPoints')
@Controller('sucursal')
export class SucursalController extends CommonController(SucursalService){
    constructor(private readonly sucursalService:SucursalService){super()}

}
