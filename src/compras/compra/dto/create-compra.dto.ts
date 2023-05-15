import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { DetalleCompra } from '../entity/detalle-compra.entity';
import { Proveedor } from '../../proveedor/entity/proveedor.entity';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';
import { Sucursal } from '../../../sucursal/sucursal/entity/sucursal.entity';


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
    detalle:DetalleCompra[]

    @IsOptional()
    sucursal:Sucursal

    @IsOptional()
    pago:Pago

}

interface Pago {
    name:string,
    code:boolean
}