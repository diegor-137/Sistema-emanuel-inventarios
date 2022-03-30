import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Proveedor } from '../../proveedor/entity/proveedor.entity';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';
import { DetallePedido } from '../entity/detalle-pedido.entity';
import { Sucursal } from '../../../sucursal/entity/sucursal.entity';

export class CreatePedidoDto {
    @IsOptional()
    @IsString()
    documento:string

    @IsOptional()
    observacion:string

    @IsBoolean()
    estado:boolean

    @IsOptional()
    proveedor:Proveedor

    @IsOptional()
    empleado:Empleado

    @IsOptional()
    detalle:DetallePedido[]

    @IsOptional()
    sucursal:Sucursal
}