import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator"
import { Producto } from "src/almacen/producto/entities/producto.entity"
import { TipoPrecioDto } from "src/almacen/tipo-precio/dto/tipo-precio.dto"
import { TipoPrecio } from "src/almacen/tipo-precio/entities/tipo-precio.entity"
import { Region } from "src/sucursales/region/entity/region.entity"


export class CreatePrecioDto {

    @IsOptional()
    @IsNumber()
    id?:number
    
    //@IsNumber()
    @IsNotEmpty()
    precio:number

    @Type(()=> TipoPrecioDto)
    @ValidateNested()
    tipoPrecio: TipoPrecio

    @IsOptional()
    producto:Producto
    
    @IsOptional()
    region:Region
}