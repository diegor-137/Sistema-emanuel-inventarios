import { IsOptional } from "class-validator"
import { Caja } from "src/finanzas/caja/entities/caja.entity"
import { CuentaPorCobrar } from "../entities/cuenta-por-cobrar.entity"

export class CreateCuentasPorCobrarDto {
    @IsOptional()
    monto: number

    @IsOptional()
    cuentaPorCobrar:CuentaPorCobrar

    @IsOptional()
    descripcion:string

    @IsOptional()
    balance:number

    @IsOptional()
    estado:boolean

    caja?:Caja
}
