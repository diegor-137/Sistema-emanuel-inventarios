import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, BeforeInsert, BeforeUpdate, OneToOne, JoinColumn } from 'typeorm';
import { Puesto } from '../../puesto/entity/puesto.entity';
import { Compra } from '../../../compras/compra/entity/compra.entity';
import { Venta } from '../../../ventas/venta/entity/venta.entity';
import { Pedido } from '../../../compras/pedido/entity/pedido-entity';
import { Cotizacion } from '../../../ventas/cotizacion/entity/cotizacion.entity';
import { Sucursal } from '../../../sucursal/sucursal/entity/sucursal.entity';
import { User } from 'src/user/entities/user.entity';
import { Cobro } from 'src/finanzas/cobro/entities/cobro.entity';
import { Caja } from 'src/finanzas/caja/entities/caja.entity';
import { CorteCaja } from '../../../finanzas/corte-caja/entities/corte-caja.entity';
import { Gasto } from '../../../finanzas/gastos/entities/gasto.entity';
import { Ingreso } from 'src/finanzas/ingresos/entities/ingreso.entity';
import { FileAws3 } from 'src/files/entities/file.entity';

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

    @Column({type:'varchar',length:50,nullable:true})
    email:string
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
    @OneToMany(() => Cobro, (cobro) => cobro.empleado)
    cobro:Cobro[]

    /*********Caja*********/ 
    @OneToOne(() => Caja, (caja) => caja.empleado)
    caja:Caja

    /*********Caja*********/
    @OneToMany(()=> CorteCaja, (corteCaja)=> corteCaja.empleado)
    corteCaja:CorteCaja[]

    @OneToMany(() => Gasto, (gasto) => gasto.empleado)
    gastos:Gasto[]

    @OneToMany(() => Gasto, (gasto) => gasto.deleteResponsible)
    gastosDelete:Gasto[]

    @OneToMany(() => Cobro, (cobro) => cobro.deleteResponsible)
    cobroDeleted:Cobro[]

    @OneToOne(() => FileAws3, fileAws3 => fileAws3.empleado, {
        nullable: true
    })
    @JoinColumn({ name: "id_foto"})
    foto: FileAws3;
    
}