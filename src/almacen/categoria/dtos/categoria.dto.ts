import { IsOptional, IsString } from "class-validator"


export class CategoriaDto {

    @IsOptional()
    id?:number

    @IsString()
    nombre: string

}