import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { EnvioService } from './envio.service';
import { CreateEnvioDto } from './dto/create-envio.dto';
import { UpdateEnvioDto } from './dto/update-envio.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('envio')
export class EnvioController {
  constructor(private readonly envioService: EnvioService) {}

  @Auth()
  @Post()
  create(@Body() createEnvioDto: CreateEnvioDto, @User() user: UserEntity) {
    return this.envioService.create(createEnvioDto, user);
  }

  @Auth()
  @Post('recepcion/:id')
  createRecepcion(@Param('id',ParseIntPipe) id:number, @User() user: UserEntity, @Body() updateEnvioDto: UpdateEnvioDto) {
    return this.envioService.recepcion(id, user, updateEnvioDto);
  }

  @Auth()
  @Get('porfecha')
  envios(@User() user: UserEntity, @Query() query: { start: Date, end:Date}) {
    return this.envioService.envios(user, query.start, query.end);
  }

  @Auth()
  @Get('ultimos/cincoSucursal')
  ultimos5Sucursal(@User() user: UserEntity) {
    return this.envioService.ultimos5Sucursal(user);
  }
  
  @Auth()
  @Get('ultimos/cincoLocal')
  ultimos5Local(@User() user: UserEntity) {
    return this.envioService.ultimos5Local(user);
  }

  @Auth()
  @Get('no-recepcion')
  enviosNoRecepcion(@User() user: UserEntity) {
    return this.envioService.enviosNoRecepcion(user);
  }

  @Auth()
  @Get('all-recepcion')
  findAllEnviosRecepcion(@User() user: UserEntity, @Query() query: { start: Date, end:Date}){
    return this.envioService.findAllEnviosRecepcion(query.start, query.end, user);
  }

  @Auth()
  @Get(':id')
  buscarEnvio(@Param('id', ParseIntPipe) id: number, @User() user: UserEntity) {
    return this.envioService.buscarEnvio(id, user);
  }

  @Auth()
  @Get('recepcion-get/:id')
  buscarEnvioRecepcion(@Param('id', ParseIntPipe) id: number, @User() user: UserEntity) {
    return this.envioService.buscarEnvioRecepcion(id, user);
  }

/*   



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.envioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnvioDto: UpdateEnvioDto) {
    return this.envioService.update(+id, updateEnvioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.envioService.remove(+id);
  } */
}
