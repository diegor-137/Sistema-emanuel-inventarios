import { IsNotEmpty } from 'class-validator';
import { Empleado } from 'src/recursos-humanos/empleado/entity/empleado.entity';
import { DetalleCuentaBancaria } from '../entities/detalle-cuenta-bancaria';

export class CreateCuentaBancariaDto {

    @IsNotEmpty()
    numero:string

    @IsNotEmpty()
    nombre:string

    @IsNotEmpty()
    detalleCuentaBancaria:DetalleCuentaBancaria[]

}
