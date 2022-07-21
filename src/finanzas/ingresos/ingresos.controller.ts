import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { IngresosService } from './ingresos.service';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { UpdateIngresoDto } from './dto/update-ingreso.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CajaService } from '../caja/caja.service';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('ingresos')
export class IngresosController {
  constructor(private readonly ingresosService: IngresosService,
              private readonly cajaService:CajaService) {}

  @Auth()
  @Get()
  async findAll(
    @Query('id', ParseIntPipe)id: number, 
    @Query('start')start: Date, 
    @Query('end')end: Date, 
    @User() user: UserEntity){    
    if(id===0){    
      const caja = await this.cajaService.findOne(user.empleado.id)
      id = caja.id
    }    
    return this.ingresosService.findAll(start, end, id);
  }
}
