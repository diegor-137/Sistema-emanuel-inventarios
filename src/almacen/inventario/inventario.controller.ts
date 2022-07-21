import { Controller, Get, Post } from '@nestjs/common';
import { CommonController } from 'src/common/controller/common.controller';
import { InventarioService } from './inventario.service';

@Controller('inventario')
export class InventarioController extends CommonController(InventarioService) {
    constructor (private readonly inventarioService:InventarioService){super()}



    
}
