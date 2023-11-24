import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { CajaService } from '../caja/caja.service';
import { CobroService } from './services/cobro.service';
import { CreateCobroDto } from './dto/create-cobro.dto';
import { UpdateCobroDto } from './dto/update-cobro.dto';
import { CajaGuard } from '../caja/guards/caja-verification.guard';
import { CobroConsultService } from './services/cobro-consult.service';

@Controller('cobro')
export class CobroController {
  constructor(private readonly cobroService: CobroService,
              private readonly CobroConsultService: CobroConsultService,
              private readonly cajaService:CajaService){}

  @Auth()
  @UseGuards(CajaGuard)
  @Post()
  async create(@Body() createCobroDto: CreateCobroDto, @User() user: UserEntity) {
    return await this.cobroService.create(createCobroDto, user);
  }

  @Auth()
  @UseGuards(CajaGuard)
  @Delete('anular/:id')
  async delete(@Param('id') id: string, @User() user: UserEntity) {
    const caja = await this.cajaService.findOne(user.empleado.id)
    return this.cobroService.delete(+id, user, caja);
  }

  @Auth()
  @UseGuards(CajaGuard)
  @Get('ventas')
  async findVentaToday(@User() user: UserEntity){
    return await this.cobroService.findVentaNoCobro(user)
  }

    /* TODO: HAY QUE ADAPTARLO A LA HORA DE ELIMINAR UNA VENTA NO SE USA EN EL FRONT*/
  @Auth()
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: UserEntity) {
    const caja = await this.cajaService.findOne(user.empleado.id)
    return this.cobroService.remove(+id, user, caja);
  }

  /* USANDO EL SERVICIO DE CONSULTAS UNICAMENTE */

  @Auth()
  @UseGuards(CajaGuard)
  @Get('cobros-dia')
  async findAllCobros(@User() user: UserEntity){
    const caja = await this.cajaService.findOne(user.empleado.id)
    return await this.CobroConsultService.findAllCobros(caja.id)
  }

  @Auth()
  @Get()
  async findAll(@Query() query: { start: Date, end:Date, id:number }) {
    return await this.CobroConsultService.findAll(query.start, query.end, query.id);
  }

  @Auth()
  @Get('deleted')
  async findAllDeleted(@Query() query: { start: Date, end:Date, id:number }) {
    return await this.CobroConsultService.findAllDeleted(query.start, query.end, query.id);
  }
   
  @Auth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.CobroConsultService.findOne(+id);
  }

  @Auth()
  @Get('detalle/:id')
  findCobro(@Param('id') id: string) {
    return this.CobroConsultService.findCobro(+id);
  }
}
