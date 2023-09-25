import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity";
import { Efectivo } from "../entities/efectivo.entity";
import { IsNotEmpty } from "class-validator";


export class CreateDetalleEfectivoDto {
    id?:number

    fecha?:Date

    @IsNotEmpty()
    documento:string

    @IsNotEmpty()
    descripcion:string

    @IsNotEmpty()
    monto:number;

    balance?:number;

    efectivo?: Efectivo;

    @IsNotEmpty()
    type: boolean;

    empleado?:Empleado
}