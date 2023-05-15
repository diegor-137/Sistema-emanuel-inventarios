import { Compra } from '../../compra/entity/compra.entity';
import { Pedido } from '../../pedido/entity/pedido-entity';
import { Column, 
        CreateDateColumn, 
        Entity, 
        OneToMany, 
        PrimaryGeneratedColumn} 
from 'typeorm';
import { CuentaPorPagar } from 'src/creditos/cuentas-por-pagar/entities/cuenta-por-pagar-entity';
import { CreditoProveedor } from 'src/creditos/credito-proveedor/entities/credito-proveedor.entity';

@Entity('proveedor')
export class Proveedor{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({type:'varchar',length:100,nullable:false})
    nombre:string

    @Column({type:'varchar',length:125,nullable:true})
    direccion:string

    @Column({type:'varchar',length:15,nullable:true})
    telefono:string

    @Column({type:'varchar',length:12,nullable:true})
    nit:string

    @Column({type:'varchar',length:30,nullable:true})
    correo:string

    @Column({type:'bool',default:true})
    estado:boolean

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date
    
    @Column({name: 'dias_credito', type:'integer',default:0, nullable: true})
    diasCredito:number

    @OneToMany(
        type => Compra,
        compra => compra.proveedor,
        )
        compra: Compra;

        @OneToMany(
        type => Pedido,
        pedido => pedido.proveedor,
        )
        pedido: Pedido;

    @OneToMany(()=> CuentaPorPagar, cuentaPorPagar => cuentaPorPagar.proveedor)
    cuentaPorPagar:CuentaPorPagar[]
    
    @OneToMany(() => CreditoProveedor, credito => credito.proveedor, { 
        cascade: ['update', 'insert']
    })
    credito:CreditoProveedor[]
}