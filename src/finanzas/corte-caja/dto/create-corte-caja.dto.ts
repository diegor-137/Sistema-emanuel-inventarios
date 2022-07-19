import { IsNumber, IsString, IsOptional, IsObject, IsArray } from 'class-validator';
import { Caja } from 'src/finanzas/caja/entities/caja.entity';
import { Empleado } from 'src/recursos-humanos/empleado/entity/empleado.entity';

export class CreateCorteCajaDto {

    caja?:Caja

    corteCajaDetalle:CreateCorteCajaDetalle[]

    empleado?:Empleado

    @IsString()
    @IsOptional()
    observacion?:string

    @IsString()
    @IsOptional()
    token?:string
    
}

export class CreateCorteCajaDetalle{
    monto: number

    concepto: string
  
    type: boolean;
}