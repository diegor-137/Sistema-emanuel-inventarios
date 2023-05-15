import { IsNotEmpty, IsNumber, IsOptional } from "class-validator"
import { Producto } from "src/almacen/producto/entities/producto.entity"
import { Region } from "src/sucursales/region/entity/region.entity"

export class CreateCostoDto {

    //@IsNumber()
    @IsNotEmpty()
    costo_prom

    //@IsNumber()
    @IsNotEmpty()
    costo_prom_old

    //@IsNumber()
    @IsNotEmpty()
    ultimo_precio

    @IsOptional()
    region:Region

    @IsOptional()
    producto:Producto
}