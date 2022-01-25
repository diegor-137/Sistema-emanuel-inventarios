import { IsOptional, IsString } from "class-validator"


export class MarcaDto {

    @IsString()
    nombre: string

}