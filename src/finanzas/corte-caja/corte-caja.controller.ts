import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, Inject, forwardRef } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { CorteCajaService } from './corte-caja.service';
import { CreateCorteCajaDto } from './dto/create-corte-caja.dto';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { UpdateCorteCajaDto } from './dto/update-corte-caja.dto';
import { CajaService } from '../caja/caja.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../auth/auth.service';

@Controller('corte-caja')
export class CorteCajaController {
  constructor(private readonly corteCajaService: CorteCajaService,
              private readonly cajaService:CajaService, 
              private readonly authService:AuthService) {}

/*   @Post()
  create(@Body() createCorteCajaDto: CreateCorteCajaDto) {
    return this.corteCajaService.create(createCorteCajaDto);
  }

  @Get()
  findAll() {
    return this.corteCajaService.findAll();
  }

  @Get('lastCorte/:id')
  lastCorte(@Param('id') id: string) {
    return this.corteCajaService.lastCorte(+id);
  }

  @Get('getBalance/:id')
  getBalance(@Param('id') id: string) {
    return this.corteCajaService.getBalance(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.corteCajaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCorteCajaDto: UpdateCorteCajaDto) {
    return this.corteCajaService.update(+id, updateCorteCajaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.corteCajaService.remove(+id);
  } */

  /* TODO:USANDO */
  @Auth()
  @Post(':monto')
  async create(@Param('monto', ParseIntPipe) monto: number, @Body() createCorteCajaDto: CreateCorteCajaDto, @User()user: UserEntity) { 
    const decodedJwtAccessToken = await this.authService.decodeToken(createCorteCajaDto.token);  
    const caja = await this.cajaService.findOne(user.empleado.id)
    createCorteCajaDto.caja = caja
    createCorteCajaDto.empleado = decodedJwtAccessToken.empleado;
    return this.corteCajaService.create(createCorteCajaDto, monto);
  }

  /* TODO:USANDO */
  @Auth()
  @Get('lastCorte')
  async lastCorte(@User()user: UserEntity){
    const {id} = await this.cajaService.findOne(user.empleado.id)   
    return this.corteCajaService.lastCorte(+id);
  }

  @Get()
  findAll(@Query() query: { start: Date, end:Date, id:number }) {
    return this.corteCajaService.findAll(query.start, query.end, query.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.corteCajaService.findOne(+id);
  }

  @Auth()
  @Get('totalGasto/caja')
  async totalGasto(@User()user: UserEntity){
    const caja = await this.cajaService.findOne(user.empleado.id)
    const {gasto} = await this.corteCajaService.totalGasto(caja.id)
    return gasto;
  }

  @Auth()
  @Get('totalCobro/caja')
  async totalCobro(@User()user: UserEntity){
    const caja = await this.cajaService.findOne(user.empleado.id)
    const {total} = await this.corteCajaService.totalCobro(caja.id)
    return total;
  }

  @Auth()
  @Get('saldo/caja')
  async saldo(@User()user: UserEntity){
    const caja = await this.cajaService.findOne(user.empleado.id)
    return this.corteCajaService.saldo(caja.id)
  }

  @Auth()
  @Get('ingreso/caja')
  async totalIngresos(@User()user: UserEntity){
    const caja = await this.cajaService.findOne(user.empleado.id)
    const {ingreso} = await this.corteCajaService.totalIngresos(caja.id)
    return ingreso;
  }

  @Auth()
  @Get('egreso/caja')
  async totalEgresos(@User()user: UserEntity){
    const caja = await this.cajaService.findOne(user.empleado.id)
    const {egreso} = await this.corteCajaService.totalEgresos(caja.id)
    return egreso;
  }

  /* DETALLES DE CORTE */



  @Auth()
  @Get('detalle/ventas-cobros/:idCorte/:idCaja')
  async ventasCobrosCorte(@Param('idCorte') idCorte: string, @Param('idCaja') idCaja: string){
    return await this.corteCajaService.ventasCobrosCorte(+idCorte, +idCaja)

  }

  @Auth()
  @Get('detalle/gastos/:idCorte/:idCaja')
  async gastosCorte(@Param('idCorte') idCorte: string, @Param('idCaja') idCaja: string){
    return await this.corteCajaService.gastosCorte(+idCorte, +idCaja)
  }

  @Auth()
  @Get('detalle/ingresos/:idCorte/:idCaja')
  async ingresosCorte(@Param('idCorte') idCorte: string, @Param('idCaja') idCaja: string){
    return await this.corteCajaService.ingresosCorte(+idCorte, +idCaja)
  }

  @Auth()
  @Get('detalle/egresos/:idCorte/:idCaja')
  async egresosCorte(@Param('idCorte') idCorte: string, @Param('idCaja') idCaja: string){
    return await this.corteCajaService.egresosCorte(+idCorte, +idCaja)
  }

}
