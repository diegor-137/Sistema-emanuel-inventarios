import { IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";
import { Caja } from '../../caja/entities/caja.entity';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';
import { FileAws3 } from '../../../files/entities/file.entity';

export class CreateGastoDto {

    @IsString()
    descripcion:string

    @IsNumberString()
    monto:number;

    @IsString()
    documento:number

    @IsString()
    @IsOptional()
    token?:string

    caja?:Caja

    empleado?:Empleado

    foto:FileAws3
}
