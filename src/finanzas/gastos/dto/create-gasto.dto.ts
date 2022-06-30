import { IsNumber, IsOptional, IsString } from "class-validator";
import { Caja } from '../../caja/entities/caja.entity';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';

export class CreateGastoDto {

    @IsString()
    descripcion:string

    @IsNumber()
    monto:number;

    @IsString()
    documento:number

    @IsString()
    @IsOptional()
    token?:string

    caja?:Caja

    empleado?:Empleado
}
