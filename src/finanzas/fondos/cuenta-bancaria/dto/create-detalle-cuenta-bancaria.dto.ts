import { IsNotEmpty } from "class-validator";
import { CuentaBancaria } from "../entities/cuenta-bancaria";
import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity";



export class CreateDetalleCuentaBancariaDto {

    @IsNotEmpty()
    documento:string

    @IsNotEmpty()
    descripcion:string

    @IsNotEmpty()
    monto:number;

    balance?:number;

    cuentaBancaria?: CuentaBancaria;

    @IsNotEmpty()
    type: boolean;

    empleado?:Empleado
}