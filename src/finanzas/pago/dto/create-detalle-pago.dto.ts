import { IsNotEmpty, IsOptional } from "class-validator";
import { CuentaBancaria } from "src/finanzas/fondos/cuenta-bancaria/entities/cuenta-bancaria";
import { TipoTransaccion } from "src/finanzas/tipo-transaccion/entities/tipo-transaccion.entity";


export class CreateDetallePagoDto {

    descripcion:string

    @IsNotEmpty()
    monto:number

    @IsNotEmpty()
    tipoTransaccion:TipoTransaccion;

    @IsOptional()
    documento:string

    @IsOptional()
    cuentaBancaria?:CuentaBancaria

}