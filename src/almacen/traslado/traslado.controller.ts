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
  async createOne(@Body() createTrasladoDto: CreateTrasladoDto, @User() user: UserEntity) {
    createTrasladoDto.solicitador = user.empleado;
    createTrasladoDto.sucursalSol = user.empleado.sucursal
    return await this.trasladoService.createOne(createTrasladoDto);
  }

  @Auth()
  @Post('autorizarTraslado/:id')
  async autorizarTraslado(@Param('id',ParseIntPipe) id:number, @User() user: UserEntity) {
    return await this.trasladoService.autorizarTraslado(id, user);
  }

  /* Traslados local */
  @Auth()
  @Get('local')
  async findAllTrasladosPorSucursalLocal(@User() user: UserEntity) {
    return await this.trasladoService.findAllTrasladosPorSucursalLocal(user);
  }

  /* Traslados autorizados sin envio remoto*/
  @Auth()
  @Get('noEnvio')
  async findAllTrasladosNoEnvio(@User() user: UserEntity) {
    return await this.trasladoService.findAllTrasladosNoEnvio(user);
  }

  @Auth()
  @Get()
  async findAllTrasladosPorSucursal(@User() user: UserEntity) {
    return await this.trasladoService.findAllTrasladosPorSucursal(user);
  }

  /* CONSULTAS */

  @Auth()
  @Get('porfecha/sucursal')
  async getTrasladosPorfechaSucusal(@User() user: UserEntity, @Query() query: { start: Date, end:Date}) {
    return await this.trasladoService.getTrasladosPorfechaSucusal(query.start, query.end, user);
  }

  @Auth()
  @Get('ultimos/cincoSucursal')
  async ultimos5Sucursal(@User() user: UserEntity){
    return await this.trasladoService.ultimos5Sucursal(user)
  }

  @Auth()
  @Get('porfecha/local')
  async getTrasladosPorfechaLocal(@User() user: UserEntity, @Query() query: { start: Date, end:Date}) {
    return await this.trasladoService.getTrasladosPorfechaLocal(query.start, query.end, user);
  }

  @Auth()
  @Get('ultimos/cinco-local')
  async ultimos5local(@User() user: UserEntity){
    return await this.trasladoService.ultimos5local(user)
  }
  
  @Auth()
  @Get('local/:id')
  async buscarTrasladoLocal(@Param('id', ParseIntPipe) id: number, @User() user: UserEntity) {
    return await this.trasladoService.buscarTrasladoLocal(id, user);
  }
  @Auth()
  @Get(':id')
  async buscarTraslado(@Param('id', ParseIntPipe) id: number, @User() user: UserEntity) {
    return await this.trasladoService.buscarTraslado(id, user);
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
