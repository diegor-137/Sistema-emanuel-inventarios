import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class TipoPrecioDto{
    
    @IsOptional()
    id?:number
    
    @IsString()
    @IsNotEmpty()
    nombre:string
}