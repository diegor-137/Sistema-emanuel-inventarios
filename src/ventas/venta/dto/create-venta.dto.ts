import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { Cliente } from '../../cliente/entity/cliente.entity';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';
import { DetalleVenta } from '../entity/detalle-venta.entity';
import { Sucursal } from '../../../sucursal/entity/sucursal.entity';

export class CreateVentaDto{
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
    detalle:DetalleVenta[]

    @IsOptional()
    sucursal:Sucursal
}