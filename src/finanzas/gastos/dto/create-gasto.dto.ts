import { IsNumber, IsNumberString, IsObject, IsOptional, IsString } from "class-validator";
import { Caja } from '../../caja/entities/caja.entity';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';
import { FileAws3 } from '../../../files/entities/file.entity';
import { TipoGasto } from "src/finanzas/tipo-gasto/entities/tipo-gasto.entity";
import { Efectivo } from "src/finanzas/fondos/efectivo/entities/efectivo.entity";
import { Sucursal } from "src/sucursal/sucursal/entity/sucursal.entity";

export class CreateGastoDto {

    @IsString()
    descripcion:string

    @IsNumberString()
    monto:number;

    @IsString()
    documento:number

    @IsString()
    solicitante?:string

    @IsString()
    @IsOptional()
    token?:string

    @IsObject()
    tipoGasto:TipoGasto

    @IsObject()
    efectivo:Efectivo

    sucursal:Sucursal

    empleado?:Empleado

    foto:FileAws3
}
