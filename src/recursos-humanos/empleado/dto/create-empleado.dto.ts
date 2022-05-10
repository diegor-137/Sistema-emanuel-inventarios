import { IsBoolean, IsOptional, IsString, IsNotEmpty, MinLength, MaxLength, IsEmail, IsArray, IsEnum } from 'class-validator';
import { Puesto } from '../../puesto/entity/puesto.entity';
import { Sucursal } from '../../../sucursal/entity/sucursal.entity';

export class CreateEmpleadoDto{
    @IsString()
    nombre:string

    @IsString()
    apellido:string

    @IsString()
    direccion:string

    @IsNotEmpty()
    telefono:string

    @IsBoolean()
    estado:boolean
     
    @IsOptional()
    puesto:Puesto

    @IsOptional()
    sucursal:Sucursal 

    @IsEmail()
    email: string;
}