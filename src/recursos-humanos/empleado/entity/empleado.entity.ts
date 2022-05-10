import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, BeforeInsert, BeforeUpdate, OneToOne } from 'typeorm';
import { Puesto } from '../../puesto/entity/puesto.entity';
import { Compra } from '../../../compras/compra/entity/compra.entity';
import { Venta } from '../../../ventas/venta/entity/venta.entity';
import { Pedido } from '../../../compras/pedido/entity/pedido-entity';
import { Cotizacion } from '../../../ventas/cotizacion/entity/cotizacion.entity';
import { Sucursal } from '../../../sucursal/entity/sucursal.entity';
import { User } from 'src/user/entities/user.entity';
import { Cobro } from 'src/finanzas/cobro/entities/cobro.entity';

@Entity('empleado')
export class Empleado{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({type:'varchar',length:75,nullable:false})
    nombre:string

    @Column({type:'varchar',length:75,nullable:true})
    apellido:string

    @Column({type:'varchar',length:125,nullable:true})
    direccion:string

    @Column({type:'varchar',length:15,nullable:true})
    telefono:string

    @Column({type:'bool',default:true})
    estado:boolean

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @Column({ type: 'varchar', length: 255, nullable: false })
    email: string;

    //Tablas Padre
    /*********Puesto*********/
    @ManyToOne(
        type => Puesto,
        puesto => puesto.empleado,
        )
    puesto: Puesto
    
    /*********Sucursal*********/
    @ManyToOne(
        type => Sucursal,
        sucursal => sucursal.empleado,
        )
    sucursal: Sucursal

    /*********Usuario*********/
    @OneToOne(() => User, (user) => user.empleado) // specify inverse side as a second parameter
    user:User

    //Tablas Hijas

    /*********Compras*********/
    @OneToMany(
        type => Compra,
        compra => compra.empleado,
        )
        compra: Compra;
    
    @OneToMany(
        type => Pedido,
        pedido => pedido.empleado,
        )
        pedido: Pedido;

    /*********Venta*********/
    @OneToMany(
        type => Venta,
        venta => venta.empleado,
        )
        venta: Venta;

    @OneToMany(
        type => Cotizacion,
        cotizacion => cotizacion.empleado,
        )
        cotizacion: Cotizacion;

    /*********Cobro*********/ 
    @OneToOne(() => Cobro, (cobro) => cobro.empleado)
    cobro:Cobro
    
}