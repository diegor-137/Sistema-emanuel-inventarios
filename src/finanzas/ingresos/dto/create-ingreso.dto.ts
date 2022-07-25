import { IsNumber, IsOptional, IsString } from "class-validator";
import { Caja } from "src/finanzas/caja/entities/caja.entity"
import { CorteCaja } from '../../corte-caja/entities/corte-caja.entity';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';

export class CreateIngresoDto {

    @IsString()
    @IsOptional()
    descripcion:string

    @IsNumber()
    @IsOptional()
    monto:number

    @IsOptional()
    caja:Caja

    /* corteCaja?:CorteCaja */
    @IsString()
    @IsOptional()
    token?:string

    empleado?:Empleado
}
