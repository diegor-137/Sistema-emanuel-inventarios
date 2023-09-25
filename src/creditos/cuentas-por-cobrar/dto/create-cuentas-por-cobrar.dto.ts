import { IsOptional } from "class-validator"
import { Caja } from "src/finanzas/caja/entities/caja.entity"
import { CuentaPorCobrar } from "../entities/cuenta-por-cobrar.entity"
import { CuentaBancaria } from "src/finanzas/fondos/cuenta-bancaria/entities/cuenta-bancaria"
import { TipoTransaccion } from "src/finanzas/tipo-transaccion/entities/tipo-transaccion.entity"

export class CreateCuentasPorCobrarDto {

    @IsOptional()
    id:number

    @IsOptional()
    comentario?:string

    @IsOptional()
    detalleCuentaPorCobrar:CreateCuentasPorCobrarDetalleDto[]

}

export class CreateCuentasPorCobrarDetalleDto{

    @IsOptional()
    monto: number

    @IsOptional()
    cuentaPorCobrar:CuentaPorCobrar

    @IsOptional()
    descripcion:string

    @IsOptional()
    balance:number

    @IsOptional()
    tipoTransaccion:TipoTransaccion

    @IsOptional()
    documento:string

    caja?:Caja

    @IsOptional()
    cuentaBancaria:CuentaBancaria
}
