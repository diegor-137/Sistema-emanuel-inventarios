import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query, Inject, forwardRef, UseGuards } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { CorteCajaService } from './corte-caja.service';
import { CreateCorteCajaDto } from './dto/create-corte-caja.dto';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { UpdateCorteCajaDto } from './dto/update-corte-caja.dto';
import { CajaService } from '../caja/caja.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../auth/auth.service';
import { CajaGuard } from '../caja/guards/caja-verification.guard';

@Controller('corte-caja')
export class CorteCajaController {
  constructor(private readonly corteCajaService: CorteCajaService,
              private readonly cajaService:CajaService, 
              private readonly authService:AuthService) {}

  @Auth()
  @UseGuards(CajaGuard)
  @Post(':monto')
  async create(@Param('monto') monto: number, @Body() createCorteCajaDto: CreateCorteCajaDto, @User()user: UserEntity) { 
    const decodedJwtAccessToken = await this.authService.decodeToken(createCorteCajaDto.token);  
    const caja = await this.cajaService.findOne(user.empleado.id)
    createCorteCajaDto.caja = caja
    createCorteCajaDto.empleado = decodedJwtAccessToken.empleado;
    return this.corteCajaService.create(createCorteCajaDto, +monto);
  }

  @Auth()
  @UseGuards(CajaGuard)
  @Get('lastCorte')
  async lastCorte(@User()user: UserEntity){
    const {id} = await this.cajaService.findOne(user.empleado.id)   
    return this.corteCajaService.lastCorte(+id);
  }

  @Auth()
  @UseGuards(CajaGuard)
  @Get('totalGasto/caja')
  async totalGasto(@User()user: UserEntity){
    const caja = await this.cajaService.findOne(user.empleado.id)
    const {gasto} = await this.corteCajaService.totalGasto(caja.id)
    return gasto;
  }

  @Auth()
  @UseGuards(CajaGuard)
  @Get('totalCobro/caja')
  async totalCobro(@User()user: UserEntity){
    const caja = await this.cajaService.findOne(user.empleado.id)
    const {total} = await this.corteCajaService.totalCobro(caja.id)
    return total;
  }

  @Auth()
  @UseGuards(CajaGuard)
  @Get('saldo/caja')
  async saldo(@User()user: UserEntity){
    const caja = await this.cajaService.findOne(user.empleado.id)
    return this.corteCajaService.saldo(caja.id)
  }

  @Auth()
  @UseGuards(CajaGuard)
  @Get('ingreso/caja')
  async totalIngresos(@User()user: UserEntity){
    const caja = await this.cajaService.findOne(user.empleado.id)
    const {ingreso} = await this.corteCajaService.totalIngresos(caja.id)
    return ingreso;
  }

  @Auth()
  @UseGuards(CajaGuard)
  @Get('egreso/caja')
  async totalEgresos(@User()user: UserEntity){
    const caja = await this.cajaService.findOne(user.empleado.id)
    const {egreso} = await this.corteCajaService.totalEgresos(caja.id)
    return egreso;
  }

  @Auth()
  @UseGuards(CajaGuard)
  @Get('cuentaPorCobrar/caja')
  async totalCuentasPorCobrar(@User()user: UserEntity){
    /* const caja = await this.cajaService.findOne(user.empleado.id)
    const {cuentaPorCobrar} = await this.corteCajaService.totalCuentasPorCobrar(caja.id)
    return cuentaPorCobrar; */
  }

  @Auth()
  @UseGuards(CajaGuard)
  @Get('ultimoMovimiento/caja')
  async ultimoMovimiento(@User()user: UserEntity){
    const {id} = await this.cajaService.findOne(user.empleado.id)  
    const movimiento = await this.corteCajaService.ultimoMovimiento(id);
    return movimiento.balance
  }

  /* BUSQUEDA POR PARTE DEL ADMINISTRADOR!!!!*/
  
  @Auth()
  @Get()
  findAll(@Query() query: { start: Date, end:Date, id:number }) {
    return this.corteCajaService.findAll(query.start, query.end, query.id);
  }

  @Auth()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.corteCajaService.findOne(+id);
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

  @Auth()
  @Get('detalle/cuentasPorCobrar/:idCorte/:idCaja')
  async cuentasPorCobrarCorte(@Param('idCorte') idCorte: string, @Param('idCaja') idCaja: string){
    return await this.corteCajaService.cuentasPorCobrarCorte(+idCorte, +idCaja)
  }


}
