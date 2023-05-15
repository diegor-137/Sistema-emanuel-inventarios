import { IsBoolean, IsOptional, IsString, IsNotEmpty, IsArray } from 'class-validator';
import { CreateCreditoProveedorDto } from '../../../creditos/credito-proveedor/dto/create-credito-proveedor.dto';

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

    @IsBoolean()
    credit:boolean

    @IsOptional()
    @IsArray()
    credito:CreateCreditoProveedorDto[]

}