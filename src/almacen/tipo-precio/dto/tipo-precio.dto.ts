import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class TipoPrecioDto{
    
    @IsOptional()
    id?:number
    
    @IsString()
    @IsOptional()
    nombre:string

    @IsBoolean()
    @IsOptional()
    estado:boolean
}