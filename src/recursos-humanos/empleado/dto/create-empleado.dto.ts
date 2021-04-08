import { IsBoolean, IsOptional, IsString } from "class-validator";
import { Puesto } from '../../puesto/entity/puesto.entity';

export class CreateEmpleadoDto{
    @IsString()
    nombre:string

    @IsString()
    direccion:string

    @IsString()
    telefono:string

    @IsBoolean()
    estado:boolean
     
    @IsOptional()
    puesto:Puesto
}