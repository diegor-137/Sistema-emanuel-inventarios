import { Caja } from "src/finanzas/caja/entities/caja.entity"
import { CorteCaja } from '../../corte-caja/entities/corte-caja.entity';

export class CreateIngresoDto {

    descripcion:string

    monto:number

    caja:Caja

    corteCaja?:CorteCaja
}
