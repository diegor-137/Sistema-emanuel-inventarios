import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Venta } from '../../venta/entity/venta.entity';
import { Cotizacion } from '../../cotizacion/entity/cotizacion.entity';


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
}