import { Body, Controller, Get, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { EgresosService } from './egresos.service';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { CajaService } from '../caja/caja.service';
import { CajaGuard } from '../caja/guards/caja-verification.guard';
import { CreateEgresoDto } from './dto/create-egreso.dto';
import { AuthService } from '../../auth/auth.service';

@Controller('egresos')
export class EgresosController {
  constructor(private readonly egresosService: EgresosService,
              private readonly cajaService:CajaService,
              private readonly authService:AuthService) {}

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
    return this.egresosService.findAll(start, end, id);
  }

  @Auth()
  @UseGuards(CajaGuard)
  @Post()
  async create(@Body() createEgresoDto: CreateEgresoDto, @User() user: UserEntity) {
    const decodedJwtAccessToken = await this.authService.decodeToken(createEgresoDto.token);
    const caja = await this.cajaService.findOne(user.empleado.id)
    createEgresoDto.empleado= decodedJwtAccessToken.empleado
    createEgresoDto.caja= caja
    return this.egresosService.crear(createEgresoDto);
  }
}
