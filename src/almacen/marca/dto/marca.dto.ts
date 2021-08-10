import { IsOptional, IsString } from "class-validator"


export class MarcaDto {

    @IsOptional()
    id?:number

    @IsString()
    nombre: string

}