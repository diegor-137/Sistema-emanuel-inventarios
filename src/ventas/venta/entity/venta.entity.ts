import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Cliente } from '../../cliente/entity/cliente.entity';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';
import { DetalleVenta } from './detalle-venta.entity';
import { Sucursal } from '../../../sucursal/entity/sucursal.entity';
import { Cobro } from 'src/finanzas/cobro/entities/cobro.entity';

@Entity('venta')
export class Venta {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 350, nullable: true })
    observacion: string

    @Column({ type: 'bool', default: true })
    estado: boolean

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone'})
    createdAt: Date

    //-----Tablas Padre--------
    @ManyToOne(
        type => Cliente,
        cliente => cliente.venta,
    )
    cliente: Cliente;

    @ManyToOne(
        type => Empleado,
        empleado => empleado.venta,
    )
    empleado: Empleado;

    @ManyToOne(
        type => Sucursal,
        sucursal => sucursal.venta,
    )
    sucursal: Sucursal;

    /*********Cobro*********/
    @OneToMany(() => Cobro, (cobro) => cobro.venta)
    cobro: Cobro[]

    //-------Tablas Hijas--------
    @OneToMany(
        type => DetalleVenta,
        detalle_venta => detalle_venta.venta,
        {
            cascade: ["insert", "update", "remove"]
        })
    detalle: DetalleVenta[];

    @Column({ type: 'varchar', length: 45, default: 'PENDIENTE'})
    status: string
}