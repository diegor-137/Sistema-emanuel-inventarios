import { IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity";
import { Sucursal } from 'src/sucursal/sucursal/entity/sucursal.entity';


export class CreateCajaDto {
    
    @IsString()
    lugar:string

    @IsObject()
    @IsOptional()
    empleado:Empleado

    @IsNumber()
    monto:number

    @IsOptional()
    estado:string

    sucursal:Sucursal

}
