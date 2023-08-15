import { Controller, Get, Post, Body, Patch, ParseIntPipe,  Param, Delete, Query } from '@nestjs/common';
import { TrasladoService } from './traslado.service';
import { CreateTrasladoDto } from './dto/create-traslado.dto';
import { UpdateTrasladoDto } from './dto/update-traslado.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';

@Controller('traslado')
export class TrasladoController {
  constructor(private readonly trasladoService: TrasladoService) {}

  @Auth()
  @Post()
  createOne(@Body() createTrasladoDto: CreateTrasladoDto, @User() user: UserEntity) {
    createTrasladoDto.solicitador = user.empleado;
    createTrasladoDto.sucursalSol = user.empleado.sucursal
    return this.trasladoService.createOne(createTrasladoDto);
  }

  @Auth()
  @Post('autorizarTraslado/:id')
  autorizarTraslado(@Param('id',ParseIntPipe) id:number, @User() user: UserEntity) {
    return this.trasladoService.autorizarTraslado(id, user);
  }

  /* Traslados local */
  @Auth()
  @Get('local')
  findAllTrasladosPorSucursalLocal(@User() user: UserEntity) {
    return this.trasladoService.findAllTrasladosPorSucursalLocal(user);
  }

  /* Traslados autorizados sin envio remoto*/
  @Auth()
  @Get('noEnvio')
  findAllTrasladosNoEnvio(@User() user: UserEntity) {
    return this.trasladoService.findAllTrasladosNoEnvio(user);
  }

  @Auth()
  @Get()
  findAllTrasladosPorSucursal(@User() user: UserEntity) {
    return this.trasladoService.findAllTrasladosPorSucursal(user);
  }

  /* CONSULTAS */

  @Auth()
  @Get('porfecha/sucursal')
  getTrasladosPorfechaSucusal(@User() user: UserEntity, @Query() query: { start: Date, end:Date}) {
    return this.trasladoService.getTrasladosPorfechaSucusal(query.start, query.end, user);
  }

  @Auth()
  @Get('ultimos/cincoSucursal')
  ultimos5Sucursal(@User() user: UserEntity){
    return this.trasladoService.ultimos5Sucursal(user)
  }

  @Auth()
  @Get('porfecha/local')
  getTrasladosPorfechaLocal(@User() user: UserEntity, @Query() query: { start: Date, end:Date}) {
    return this.trasladoService.getTrasladosPorfechaLocal(query.start, query.end, user);
  }

  @Auth()
  @Get('ultimos/cinco-local')
  ultimos5local(@User() user: UserEntity){
    return this.trasladoService.ultimos5local(user)
  }
  
  @Auth()
  @Get('local/:id')
  buscarTrasladoLocal(@Param('id', ParseIntPipe) id: number, @User() user: UserEntity) {
    return this.trasladoService.buscarTrasladoLocal(id, user);
  }
  @Auth()
  @Get(':id')
  buscarTraslado(@Param('id', ParseIntPipe) id: number, @User() user: UserEntity) {
    return this.trasladoService.buscarTraslado(id, user);
  }
/* 

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trasladoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTrasladoDto: UpdateTrasladoDto) {
    return this.trasladoService.update(+id, updateTrasladoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.trasladoService.remove(+id);
  } */
}
