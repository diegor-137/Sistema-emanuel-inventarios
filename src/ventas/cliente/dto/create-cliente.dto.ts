import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateClienteDto{
    @IsString()
    nombre:string

    @IsOptional()
    @IsString()
    direccion:string

    @IsOptional()
    @IsString()
    telefono:string

    @IsOptional()
    @IsString()
    nit:string

    @IsBoolean()
    estado:boolean
}