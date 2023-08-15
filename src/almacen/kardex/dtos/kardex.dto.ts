import { IsNumber, IsOptional, IsString } from "class-validator";
import { Producto } from "src/almacen/producto/entities/producto.entity";
import { Sucursal } from "src/sucursal/sucursal/entity/sucursal.entity";

export class CreateKardexDto{

    @IsString()
    concepto: string

    @IsNumber()
    transaccion:number

    @IsNumber()
    cantidad: number

    @IsNumber()
    nuevaCantidad: number

    @IsOptional()
    producto:Producto

    @IsOptional()
    sucursal:Sucursal
}