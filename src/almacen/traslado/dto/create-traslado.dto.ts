import { IsNotEmpty, IsNotEmptyObject, IsOptional, IsString } from "class-validator";
import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity";
import { Sucursal } from "src/sucursal/sucursal/entity/sucursal.entity";
import { DetalleTraslado } from "../entities/detalle-traslado";
import { Envio } from "src/almacen/envio/entities/envio.entity";



export class CreateTrasladoDto {

    @IsOptional()
    @IsString()
    observacion:string;

    responsable:Empleado;

    @IsNotEmptyObject()
    sucursalResp: Sucursal;

    solicitador:Empleado;

    sucursalSol: Sucursal;

    @IsOptional()
    detalle: DetalleTraslado[];

    envio?: Envio

    status?:string

}
