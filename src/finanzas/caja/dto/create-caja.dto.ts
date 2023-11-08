import { IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { Efectivo } from "src/finanzas/fondos/efectivo/entities/efectivo.entity";
import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity";
import { Sucursal } from 'src/sucursal/sucursal/entity/sucursal.entity';


export class CreateCajaDto {
    
    @IsString()
    nombre:string

    @IsObject()
    @IsOptional()
    empleado:Empleado

    @IsNumber()
    monto:number
    
    @IsNumber()
    montoCajaChica:number

    @IsOptional()
    estado:string

    sucursal:Sucursal

    efectivo:Efectivo
}
