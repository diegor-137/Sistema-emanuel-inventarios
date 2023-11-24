import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { Cliente } from '../../cliente/entity/cliente.entity';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';
import { DetalleVenta } from '../entity/detalle-venta.entity';
import { Sucursal } from '../../../sucursal/sucursal/entity/sucursal.entity';
import { CreateCobroDto } from 'src/finanzas/cobro/dto/create-cobro.dto';

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

    @IsOptional()
    pago?:Pago

    status?:string

    @IsOptional()
    cobroVenta?:CreateCobroDto
}

interface Pago {
    name:string,
    code:boolean
}