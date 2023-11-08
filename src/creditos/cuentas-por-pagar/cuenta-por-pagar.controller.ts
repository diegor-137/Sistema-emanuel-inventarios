import { Controller, Get, Post, Body, Param, ParseIntPipe, ParseBoolPipe, Query } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { CuentaPorPagarService } from './cuenta-por-pagar.service';
import { CreateCuentaPorPagarDto } from './dto/create-cuenta-por-pagar.dto';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { ConsultCuentasPorPagarDto } from './dto/consult-cuentas-por-pagar.dto';


@Controller('cuentas-por-pagar')
export class CuentaPorPagarController {
  constructor(private readonly cuentaPorPagarService: CuentaPorPagarService) {}
  
  @Auth()
  @Post('getCuentasPorPagarParams')
  async getCuentasPorPagarParams(@Body()dto:ConsultCuentasPorPagarDto, @User() user: UserEntity){
     return this.cuentaPorPagarService.getCuentasPorPagarParams(user.empleado.sucursal, dto.checked, dto.dates, dto.id);
  }

/*   @Post('pagarCreditos')
  async pagarCreditos(@Body() creditoCompras:CreateCuentaPorPagarDto[]){        
    return await this.cuentaPorPagarService.pagarCreditos(creditoCompras)
  } */

  @Auth()
  @Post('pagarCredito')
  async pagarCredito(@Body() creditoCompra:CreateCuentaPorPagarDto, @User() user: UserEntity){
    return await this.cuentaPorPagarService.pago(creditoCompra, user)
  }

  @Get('pagosDetail/:id')
  async pagosDetail(@Param('id',ParseIntPipe) id:number){
    return await this.cuentaPorPagarService.pagosDetail(id)
  }

}
