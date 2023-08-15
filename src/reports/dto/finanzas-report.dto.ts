import { IsNotEmpty, IsOptional } from "class-validator";
import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity";
import { Cliente } from "src/ventas/cliente/entity/cliente.entity";



export class finanzasReport {

    @IsOptional()
    cliente:Cliente

    @IsOptional()
    empleado:Empleado

}