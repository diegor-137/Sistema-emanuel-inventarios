import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { Cliente } from '../../cliente/entity/cliente.entity';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';
import { DetalleCotizacion } from '../entity/detalle-cotizacion.entity';
import { Sucursal } from '../../../sucursal/sucursal/entity/sucursal.entity';

export class CreateCotizacionDto{
    @IsOptional()
    @IsString()
    observacion:string

    @IsBoolean()
    estado:boolean

    @IsOptional()
    cliente:Cliente

    @IsOptional()
    empleado:Empleado

    @IsOptional()
    detalle:DetalleCotizacion[]

    @IsOptional()
    sucursal:Sucursal
}