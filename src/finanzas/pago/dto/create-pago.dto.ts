import { ArrayNotEmpty, IsNotEmpty, IsOptional } from "class-validator";
import { Compra } from "src/compras/compra/entity/compra.entity";
import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity";
import { CreateDetallePagoDto } from "./create-detalle-pago.dto";

export class CreatePagoDto {

    @IsOptional()
    empleado:Empleado

    @IsOptional()
    compra:Compra

    @IsNotEmpty()
    efectivo?:number
/* 
    @Type(()=> CreateDetalleCobroDto)
    @ValidateNested({each: true}) */
    @ArrayNotEmpty()
    detallePago: CreateDetallePagoDto[];

}
