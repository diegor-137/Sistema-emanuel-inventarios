import { Controller, Get, Post, Body, Param, ParseIntPipe, ParseBoolPipe, Query } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { CuentaPorPagarService } from './cuenta-por-pagar.service';
import { CreateCuentaPorPagarDto } from './dto/create-cuenta-por-pagar.dto';
import { User as UserEntity} from 'src/user/entities/user.entity';


@Controller('cuentas-por-pagar')
export class CuentaPorPagarController {
  constructor(private readonly cuentaPorPagarService: CuentaPorPagarService) {}
  
  @Auth()
  @Get('getCuentasPorPagarByProveedor/:id/:checked')
  async getCuentasPorPagarByProveedor(@Param('id',ParseIntPipe) id:number, @Param('checked', ParseBoolPipe) checked:boolean, @Query('start')start: Date,@Query('end')end: Date, @User() user: UserEntity){
    return await this.cuentaPorPagarService.getCuentasPorPagarByProveedor(id, user.empleado.sucursal, checked, start, end);
  }

  @Auth()
  @Get('getTodosCuentasPorPagar')
  async getTodosCuentasPorPagar(@User() user: UserEntity){
    return await this.cuentaPorPagarService.getTodosCuentasPorPagar(user.empleado.sucursal);
  }

  @Post('pagarCreditos')
  async pagarCreditos(@Body() creditoCompras:CreateCuentaPorPagarDto[]){        
    return await this.cuentaPorPagarService.pagarCreditos(creditoCompras)
  }

  @Post('pagarCredito')
  async pagarCredito(@Body() creditoCompra:CreateCuentaPorPagarDto){
    return await this.cuentaPorPagarService.pagarCredito(creditoCompra)
  }

  @Get('pagosDetail/:id')
  async pagosDetail(@Param('id',ParseIntPipe) id:number){
    return await this.cuentaPorPagarService.pagosDetail(id)
  }

}
