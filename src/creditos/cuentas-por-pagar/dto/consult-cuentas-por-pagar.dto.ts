import { IsBoolean, IsOptional } from "class-validator"

export class ConsultCuentasPorPagarDto {

    @IsOptional()
    id?:number

    @IsOptional()
    dates:Date[]

    @IsBoolean()
    checked:boolean

}