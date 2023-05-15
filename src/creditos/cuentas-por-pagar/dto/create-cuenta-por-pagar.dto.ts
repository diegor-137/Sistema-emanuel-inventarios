import { IsOptional } from 'class-validator';
import { CuentaPorPagar } from '../entities/cuenta-por-pagar-entity';

export class CreateCuentaPorPagarDto {
    @IsOptional()
    monto: number

    @IsOptional()
    cuentaPorPagar:CuentaPorPagar

    @IsOptional()
    descripcion:string

    @IsOptional()
    balance:number

    @IsOptional()
    estado:boolean
}
