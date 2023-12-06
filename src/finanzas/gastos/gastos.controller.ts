import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { GastosService } from './gastos.service';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { CajaService } from '../caja/caja.service';
import { AuthService } from '../../auth/auth.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { CajaGuard } from '../caja/guards/caja-verification.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('gastos')
export class GastosController {
  constructor(private readonly gastosService: GastosService,
              private readonly cajaService:CajaService,
              private readonly authService:AuthService){}

  @Auth()
  @Post()
  @UseInterceptors(FileInterceptor('fotoSend'))
  async create(@UploadedFile() fotoSend: Express.Multer.File,@Body() createGastoDto: CreateGastoDto, @User() user: UserEntity) {    
    const decodedJwtAccessToken = await this.authService.decodeToken(createGastoDto.token);
    createGastoDto.empleado= decodedJwtAccessToken.empleado
    return this.gastosService.create(createGastoDto, fotoSend, user);
  }

  @Auth()
  @UseGuards(CajaGuard)
  @Delete('delete/:id')
  async deleteGasto(@Param('id') id: number, @User() user: UserEntity){ 
    return this.gastosService.deleteGasto(id, user);
  }

  @Auth()
  @Get()
  async findAll(
    @Query('id', ParseIntPipe)id: number, 
    @Query('start')start: Date, 
    @Query('end')end: Date, 
    @User() user: UserEntity){       
    return this.gastosService.findAll(start, end, user);
  }

  @Auth()
  @Get('deleted/all')
  async findAllDeletedGastos(@Query('id', ParseIntPipe)id: number,@Query('start')start: Date,@Query('end')end: Date){
    return this.gastosService.findAllDeletedGastos(start, end, id);
  }

}
