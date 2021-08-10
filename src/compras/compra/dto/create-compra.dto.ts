import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { DetalleCompra } from '../entity/detalle-compra.entity';
import { Proveedor } from '../../proveedor/entity/proveedor.entity';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';


export class CreateCompraDto {
    @IsString()
    documento:string

    @IsOptional()
    @IsString()
    observacion:string

    @IsBoolean()
    estado:boolean

    @IsOptional()
    proveedor:Proveedor

    @IsOptional()
    empleado:Empleado

    @IsOptional()
    detalle_compra:DetalleCompra[]
}