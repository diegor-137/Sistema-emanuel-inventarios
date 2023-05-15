import { Proveedor } from "src/compras/proveedor/entity/proveedor.entity";
import { Sucursal } from "src/sucursal/entity/sucursal.entity";

export class CreateCreditoProveedorDto {

    sucursal?: Sucursal;

    proveedor?: Proveedor

    limite:number;

    diasCredito:number

    estado?:boolean

}
