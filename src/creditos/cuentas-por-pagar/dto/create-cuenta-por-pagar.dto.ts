import { IsNotEmpty, IsOptional } from 'class-validator';
import { CuentaPorPagar } from '../entities/cuenta-por-pagar-entity';
import { TipoTransaccion } from 'src/finanzas/tipo-transaccion/entities/tipo-transaccion.entity';
import { CuentaBancaria } from 'src/finanzas/fondos/cuenta-bancaria/entities/cuenta-bancaria';

export class CreateCuentaPorPagarDto {

    @IsOptional()
    id:number

    @IsOptional()
    comentario?:string

    @IsNotEmpty()
    efectivo:number

    @IsOptional()
    detalleCuentaPorPagar:CreateCuentasPorPagarDetalleDto[]

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
    tipoTransaccion:TipoTransaccion

    @IsOptional()
    documento:string

    @IsOptional()
    estado:boolean

    @IsOptional()
    cuentaBancaria:CuentaBancaria

}
