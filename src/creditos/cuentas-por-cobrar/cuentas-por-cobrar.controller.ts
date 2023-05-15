import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ParseBoolPipe, Query } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CuentasPorCobrarService } from './cuentas-por-cobrar.service';
import { CreateCuentasPorCobrarDto } from './dto/create-cuentas-por-cobrar.dto';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { User } from 'src/auth/decorators/user.decorator';
import { CajaService } from 'src/finanzas/caja/caja.service';

@Controller('cuentas-por-cobrar')
export class CuentasPorCobrarController {
  constructor(private readonly cuentasPorCobrarService: CuentasPorCobrarService, private readonly cajaService:CajaService) {}

  @Auth()
  @Get('getCuentasPorCobrarbyCliente/:id/:checked')
  async getCuentasPorCobrarbyCliente(@Param('id',ParseIntPipe) id:number, @Param('checked', ParseBoolPipe) checked:boolean, @Query('start')start: Date,@Query('end')end: Date, @User() user: UserEntity){
    return await this.cuentasPorCobrarService.getCuentasPorCobrarbyCliente(id, user.empleado.sucursal, checked, start, end);
  }

  @Auth()
  @Get('getTodostCuentasPorCobrar')
  async getTodostCuentasPorCobrar(@User() user: UserEntity){
    return await this.cuentasPorCobrarService.getTodostCuentasPorCobrar(user.empleado.sucursal);
  }

  @Auth()
  @Post('pagarCreditos')
  async pagarCreditos(@Body() cuentasPorCobrarDetalle:CreateCuentasPorCobrarDto[], @User() user: UserEntity){
    const caja = await this.cajaService.findOne(user.empleado.id)
    cuentasPorCobrarDetalle.forEach(r=> r.caja = caja);        
    return await this.cuentasPorCobrarService.pagarCreditos(cuentasPorCobrarDetalle, caja)
  }

  @Auth()
  @Post('pagarCredito')
  async pagarCredito(@Body() cuentaPorCobrarDetalle:CreateCuentasPorCobrarDto, @User() user: UserEntity){
    const caja = await this.cajaService.findOne(user.empleado.id)
    cuentaPorCobrarDetalle.caja = caja;
    return await this.cuentasPorCobrarService.pagarCredito(cuentaPorCobrarDetalle)
  }

  @Get('pagosDetail/:id')
  async pagosDetail(@Param('id',ParseIntPipe) id:number){
    return await this.cuentasPorCobrarService.pagosDetail(id)
  }
}
