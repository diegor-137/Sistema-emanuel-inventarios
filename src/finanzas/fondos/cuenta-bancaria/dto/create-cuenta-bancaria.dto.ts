import { IsNotEmpty, IsOptional } from 'class-validator';
import { Empleado } from 'src/recursos-humanos/empleado/entity/empleado.entity';
import { DetalleCuentaBancaria } from '../entities/detalle-cuenta-bancaria';
import { CreateDetalleCuentaBancariaDto } from './create-detalle-cuenta-bancaria.dto';
import { Sucursal } from 'src/sucursal/sucursal/entity/sucursal.entity';
import { Banco } from '../../bancos/entities/banco.entity';
import { Region } from 'src/sucursales/region/entity/region.entity';

export class CreateCuentaBancariaDto {

    @IsOptional()
    id:number

    @IsNotEmpty()
    numero:string

    @IsNotEmpty()
    nombre:string

    @IsNotEmpty()
    banco:Banco

    empleado:Empleado

    region:Region

    @IsNotEmpty()
    detalleCuentaBancaria:CreateDetalleCuentaBancariaDto[]

}
