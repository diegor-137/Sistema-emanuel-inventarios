import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, ParseBoolPipe, Query } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CuentasPorCobrarService } from './cuentas-por-cobrar.service';
import { CreateCuentasPorCobrarDto } from './dto/create-cuentas-por-cobrar.dto';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { User } from 'src/auth/decorators/user.decorator';
import { CajaService } from 'src/finanzas/caja/caja.service';
import { ConsultCuentasPorCobrarDto } from './dto/consult-cuentas-por-cobrar.dto';

@Controller('cuentas-por-cobrar')
export class CuentasPorCobrarController {
  constructor(private readonly cuentasPorCobrarService: CuentasPorCobrarService, private readonly cajaService:CajaService) {}

  @Auth()
  @Post('getCuentasPorCobrarParams')
  async getCuentasPorCobrarParams(@User() user: UserEntity,@Body() dto:ConsultCuentasPorCobrarDto){
    return await this.cuentasPorCobrarService.getCuentasPorCobrarParams(user.empleado.sucursal, dto.checked, dto.dates, dto.id);
  }

  @Auth()
  @Post('pagarCredito')
  async pagarCredito(@Body() cuentaPorCobrar:CreateCuentasPorCobrarDto, @User() user: UserEntity){
    const caja = await this.cajaService.findOne(user.empleado.id)  
    return await this.cuentasPorCobrarService.pago(cuentaPorCobrar, user, caja);
  }

  @Get('pagosDetail/:id')
  async pagosDetail(@Param('id',ParseIntPipe) id:number){
    return await this.cuentasPorCobrarService.pagosDetail(id)
  }
}
