import { IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { TipoPrecio } from '../../tipo-precio/entities/tipo-precio.entity';
import { TipoPrecioDto } from '../../tipo-precio/dto/tipo-precio.dto';
import { Type } from "class-transformer";





export class PrecioDto {

    @IsOptional()
    @IsNumber()
    id?:number
    //@IsNumber()
    @IsNotEmpty()
    precio:number

    @Type(()=> TipoPrecioDto)
    @ValidateNested()
    tipoPrecio: TipoPrecio

}