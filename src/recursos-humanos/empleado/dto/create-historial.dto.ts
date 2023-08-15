import { IsOptional, IsString } from "class-validator"
import { Empleado } from "../entity/empleado.entity"

export class CreateHistorialEmpDto{
    @IsString()
    accion:string

    @IsString()
    motivo:string

    @IsString()
    usuario:string

    @IsOptional()
    empleado:Empleado    

}