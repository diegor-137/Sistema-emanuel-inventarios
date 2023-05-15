import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Venta } from '../../venta/entity/venta.entity';
import { Cotizacion } from '../../cotizacion/entity/cotizacion.entity';
import { CuentaPorCobrar } from '../../../creditos/cuentas-por-cobrar/entities/cuenta-por-cobrar.entity';
import { CreditoCliente } from 'src/creditos/credito-cliente/entities/credito-cliente.entity';


@Entity('cliente')
export class Cliente{
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

    @Column({type:'bool',default:true})
    estado:boolean

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date

    @Column({name: 'dias_credito', type:'integer',default:0, nullable: true})
    diasCredito:number
    
    @OneToMany(
        type => Venta,
        venta => venta.cliente,
        )
        venta: Venta;

    @OneToMany(
        type => Cotizacion,
        cotizacion => cotizacion.cliente
        )
        cotizacion: Cotizacion;

    @OneToMany(()=> CuentaPorCobrar, cuentaPorCobrar => cuentaPorCobrar.cliente)
    cuentaPorCobrar:CuentaPorCobrar 
    
    @OneToMany(() => CreditoCliente, credito => credito.cliente)
    credito:CreditoCliente[]
}