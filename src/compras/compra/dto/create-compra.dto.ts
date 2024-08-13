import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { DetalleCompra } from '../entity/detalle-compra.entity';
import { Proveedor } from '../../proveedor/entity/proveedor.entity';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';
import { Sucursal } from '../../../sucursal/sucursal/entity/sucursal.entity';
import { CuentaBancaria } from 'src/finanzas/fondos/cuenta-bancaria/entities/cuenta-bancaria';
import { CreatePagoDto } from 'src/finanzas/pago/dto/create-pago.dto';


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
    pagoType:PagoType

    @IsOptional()
    cuenta?:CuentaBancaria

    @IsOptional()
    doc?:string

    @IsOptional()
    pago?:CreatePagoDto[]

}

interface PagoType {
    name:string,
    code:boolean
}