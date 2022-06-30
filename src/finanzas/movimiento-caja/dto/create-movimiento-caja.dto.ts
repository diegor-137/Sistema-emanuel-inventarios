import { Caja } from '../../caja/entities/caja.entity';
export class CreateMovimientoCajaDto {

    descripcion:string

    monto:number;

    balance?:number;

    caja?:Caja;

    type?:boolean
}
