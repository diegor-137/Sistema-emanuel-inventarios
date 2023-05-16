
import { Sucursal } from 'src/sucursal/sucursal/entity/sucursal.entity';
import { Cliente } from '../../../ventas/cliente/entity/cliente.entity';
export class CreateCreditoClienteDto {

    id?:number

    sucursal?: Sucursal;

    cliente?: Cliente

    limite:number;

    diasCredito:number

    estado?:boolean
}
