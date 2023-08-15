import { IsNotEmpty, IsOptional, IsString } from "class-validator"
import { Traslado } from "src/almacen/traslado/entities/traslado.entity"
import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity"
import { Sucursal } from "src/sucursal/sucursal/entity/sucursal.entity"



export class CreateEnvioDto {

    @IsOptional()
    @IsString()
    observacionEnvio: string

    @IsOptional()
    @IsString()
    observacionRecepcion: string

    @IsNotEmpty()
    traslado: Traslado

    despachador:Empleado;

    recepcionador:Empleado;

    sucursalDespachador: Sucursal;

    sucursalRecepcionador: Sucursal;

}
