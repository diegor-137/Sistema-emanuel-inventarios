import { IsBoolean, IsNumber, IsOptional } from "class-validator";
import { Producto } from '../../../almacen/producto/entities/producto.entity';

export class CreateDetalleCompraDto{
    @IsNumber()
    cantidad:number

    @IsNumber()
    precio:number

    @IsBoolean()
    estado:boolean

    @IsOptional()
    producto:Producto
}