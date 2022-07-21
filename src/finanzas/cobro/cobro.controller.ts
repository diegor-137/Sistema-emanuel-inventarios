import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { CajaService } from '../caja/caja.service';
import { CobroService } from './cobro.service';
import { CreateCobroDto } from './dto/create-cobro.dto';
import { UpdateCobroDto } from './dto/update-cobro.dto';

@Controller('cobro')
export class CobroController {
  constructor(private readonly cobroService: CobroService,
              private readonly cajaService:CajaService,
              private readonly authService:AuthService){}

  @Auth()
  @Post()
  async create(@Body() createCobroDto: CreateCobroDto, @User() user: UserEntity) {
    const decodedJwtAccessToken = await this.authService.decodeToken(createCobroDto.token);
    const caja = await this.cajaService.findOne(user.empleado.id)
    createCobroDto.empleado= decodedJwtAccessToken.empleado
    createCobroDto.caja= caja
    return await this.cobroService.create(createCobroDto);
  }

  @Get()
  async findAll(@Query() query: { start: Date, end:Date, id:number }) {
    return await this.cobroService.findAll(query.start, query.end, query.id);
  }

  @Auth()
  @Get('ventas')
  async findVentaToday(@User() user: UserEntity){
    return await this.cobroService.findVentaToday(user)
  }

  @Auth()
  @Get('cobros-dia')
  async findAllCobros(@User() user: UserEntity){
    const caja = await this.cajaService.findOne(user.empleado.id)
    return await this.cobroService.findAllCobros(caja.id)
  }
    
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cobroService.findOne(+id);
  }
  @Get('detalle/:id')
  findCobro(@Param('id') id: string) {
    return this.cobroService.findCobro(+id);
  }

  @Auth()
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: UserEntity) {
    const caja = await this.cajaService.findOne(user.empleado.id)
    return this.cobroService.remove(+id, user, caja);
  }

  @Auth()
  @Delete('anular/:id')
  async delete(@Param('id') id: string, @User() user: UserEntity) {
    const caja = await this.cajaService.findOne(user.empleado.id)
    return this.cobroService.delete(+id, user, caja);
  }
}
