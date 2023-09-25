import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CuentaBancaria } from "src/finanzas/fondos/cuenta-bancaria/entities/cuenta-bancaria";
import { Efectivo } from "src/finanzas/fondos/efectivo/entities/efectivo.entity";

export class CreateConfiguracionesGlobalDto {

    @IsNotEmpty()
    id:number

    @IsNotEmpty()
    efectivo:Efectivo

    @IsOptional()
    cuentaBancaria:CuentaBancaria
}
