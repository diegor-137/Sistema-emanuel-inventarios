import { IsNotEmpty, IsString } from "class-validator";
import { TipoCobro } from "src/finanzas/tipo-cobro/entities/tipo-cobro.entity";

export class CreateDetalleCobroDto {

    @IsString()
    descripcion:string

    @IsNotEmpty()
    cantidad:number

    @IsNotEmpty()
    tipoCobro:TipoCobro;

}
