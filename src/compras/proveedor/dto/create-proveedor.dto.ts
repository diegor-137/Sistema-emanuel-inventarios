import { IsBoolean, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateProveedorDto{
    
    @IsString()
    nombre:string

    @IsString()
    direccion:string

    @IsNotEmpty()
    telefono:string

    @IsString()
    nit:string

    @IsString()
    correo:string

    @IsBoolean()
    estado:boolean

}