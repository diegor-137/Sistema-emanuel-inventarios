import { IsBoolean, IsOptional } from "class-validator"

export class ConsultCuentasPorCobrarDto {

    @IsOptional()
    id?:number

    @IsOptional()
    dates:Date[]

    @IsBoolean()
    checked:boolean

}