import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Proveedor } from '../../../compras/proveedor/entity/proveedor.entity';
import { Sucursal } from "src/sucursal/sucursal/entity/sucursal.entity";

@Entity('credito-proveedor')
export class CreditoProveedor {

    @PrimaryGeneratedColumn({name: 'id_credito'})
    id: number

    @ManyToOne(() => Sucursal, sucursal => sucursal.credito)
    sucursal?: Sucursal;

    @ManyToOne(() => Proveedor, proveedor => proveedor.credito, {
        cascade: ['update', 'insert']
    })
    proveedor: Proveedor;    

    @Column({type:"decimal",precision:10,scale:2})
    limite:number;

    @Column({name: 'dias_credito', type:'integer',default:0, nullable: true})
    diasCredito:number

    @Column({type:'bool',default:true})
    estado:boolean
}
