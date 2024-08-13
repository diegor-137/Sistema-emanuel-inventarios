import { IsNotEmpty, IsOptional } from 'class-validator';
import { CuentaPorPagar } from '../entities/cuenta-por-pagar-entity';
import { TipoTransaccion } from 'src/finanzas/tipo-transaccion/entities/tipo-transaccion.entity';
import { CuentaBancaria } from 'src/finanzas/fondos/cuenta-bancaria/entities/cuenta-bancaria';
import { CreatePagoDto } from 'src/finanzas/pago/dto/create-pago.dto';

export class CreateCuentaPorPagarDto {

    @IsOptional()
    id:number

    @IsOptional()
    comentario?:string

    @IsOptional()
    pago:CreatePagoDto

}

export class CreateCuentasPorPagarDetalleDto {

    @IsOptional()
    monto: number

    @IsOptional()
    cuentaPorPagar?:CuentaPorPagar

    @IsOptional()
    descripcion:string

    @IsOptional()
    balance:number

    @IsOptional()
    documento:string
}
