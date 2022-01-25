import { IsOptional, IsString } from "class-validator"


export class CategoriaDto {

    @IsString()
    nombre: string

}