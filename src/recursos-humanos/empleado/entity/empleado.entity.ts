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
import { FileAws3 } from 'src/files/entities/file.entity';
import { historialEmp } from './historial-emp.entity';
import { Traslado } from 'src/almacen/traslado/entities/traslado.entity';
import { Envio } from 'src/almacen/envio/entities/envio.entity';
import { CuentaBancaria } from 'src/finanzas/fondos/cuenta-bancaria/entities/cuenta-bancaria';
import { DetalleCuentaBancaria } from 'src/finanzas/fondos/cuenta-bancaria/entities/detalle-cuenta-bancaria';
import { Efectivo } from 'src/finanzas/fondos/efectivo/entities/efectivo.entity';
import { DetalleEfectivo } from 'src/finanzas/fondos/efectivo/entities/detalle-efectivo';
import { Pago } from 'src/finanzas/pago/entities/pago.entity';

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

    /*********Pago*********/ 
    @OneToMany(() => Pago, (pago) => pago.empleado)
    pago:Pago[]

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
    

    /*********Historial Empleado*********/
    @OneToMany(
        type => historialEmp,
        historialemp => historialemp.empleado,
        )
        historialemp: historialEmp;
    /*********Traslados*********/
    @OneToMany(() => Traslado, (traslado) => traslado.responsable, {
        nullable: true
    })
    trasladoRes:Traslado[]

    @OneToMany(() => Traslado, (traslado) => traslado.solicitador)
    trasladoSol:Traslado[]

    /*********Envios*********/
    @OneToMany(() => Envio, (envio) => envio.despachador)
    envioDespachador:Envio[]

    @OneToMany(() => Envio, (envio) => envio.recepcionador)
    envioRecepcionador:Envio[]

    /*********Cuenta Bancaria*********/
    @OneToMany(() => CuentaBancaria, (cuentaBancaria) => cuentaBancaria.empleado)
    cuentaBancaria:CuentaBancaria[]

    /*********Detalle cuenta Bancaria*********/
    @OneToMany(() => DetalleCuentaBancaria, (detalleCuentaBancaria) => detalleCuentaBancaria.empleado)
    detalleCuentaBancaria:DetalleCuentaBancaria[]

    /*********Efectivo*********/
    @OneToMany(() => Efectivo, (efectivo) => efectivo.empleado)
    efectivo:Efectivo[]

    /*********Detalle Efectivo*********/
    @OneToMany(() => DetalleEfectivo, (detalleEfectivo) => detalleEfectivo.empleado)
    detalleEfectivo:DetalleEfectivo[]
}