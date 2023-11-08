import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Banco } from "src/finanzas/fondos/bancos/entities/banco.entity";
import { CuentaBancaria } from "src/finanzas/fondos/cuenta-bancaria/entities/cuenta-bancaria";
import { TipoTransaccion } from "src/finanzas/tipo-transaccion/entities/tipo-transaccion.entity";

export class CreateDetalleCobroDto {

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
