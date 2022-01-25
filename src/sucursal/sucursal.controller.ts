import { Controller, Post } from '@nestjs/common';
import { CommonController } from '../common/controller/common.controller';
import { SucursalService } from './sucursal.service';

@Controller('sucursal')
export class SucursalController extends CommonController(SucursalService){
    constructor(private readonly sucursalService:SucursalService){super()}

}
