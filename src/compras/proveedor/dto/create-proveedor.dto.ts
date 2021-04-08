import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateProveedorDto{
    
    @IsString()
    nombre:string

    @IsString()
    direccion:string

    @IsString()
    telefono:string

    @IsString()
    nit:string

    @IsString()
    correo:string

    @IsBoolean()
    estado:boolean

}