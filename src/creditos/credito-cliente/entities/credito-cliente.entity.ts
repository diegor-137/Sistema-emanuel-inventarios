
import { Sucursal } from "src/sucursal/sucursal/entity/sucursal.entity";
import { Cliente } from "src/ventas/cliente/entity/cliente.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('credito-cliente')
export class CreditoCliente {

    @PrimaryGeneratedColumn({name: 'id_credito'})
    id: number

    @ManyToOne(() => Sucursal, sucursal => sucursal.credito)
    sucursal?: Sucursal;

    @ManyToOne(() => Cliente, cliente => cliente.credito, {
        cascade: ['update', 'insert']
    })
    cliente: Cliente;    

    @Column({type:"decimal",precision:10,scale:2})
    limite:number;

    @Column({name: 'dias_credito', type:'integer',default:0, nullable: true})
    diasCredito:number

    @Column({type:'bool',default:true})
    estado:boolean

   

    

}
