import { IsBoolean, IsOptional, IsString } from "class-validator"


export class MarcaDto {

    @IsString()
    nombre: string

    @IsBoolean()
    estado: boolean
}