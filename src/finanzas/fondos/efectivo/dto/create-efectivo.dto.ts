import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity";
import { Sucursal } from "src/sucursal/sucursal/entity/sucursal.entity";
import { DetalleEfectivo } from "../entities/detalle-efectivo";
import { IsNotEmpty, IsOptional } from "class-validator";
import { CreateDetalleEfectivoDto } from "./create-detalle-efectivo.dto";

export class CreateEfectivoDto {

    @IsOptional()
    id?:number

    fecha?:Date

    empleado?:Empleado

    sucursal?:Sucursal

    @IsNotEmpty()
    detalleEfectivo: CreateDetalleEfectivoDto[];

    estado?: boolean

    cajaUse?: boolean

    @IsNotEmpty()
    nombre:string

}
