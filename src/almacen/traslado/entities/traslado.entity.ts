import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DetalleTraslado } from "./detalle-traslado";
import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity";
import { Sucursal } from "src/sucursal/sucursal/entity/sucursal.entity";
import { Envio } from "src/almacen/envio/entities/envio.entity";

@Entity('traslado')
export class Traslado {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 350, nullable: true })
    observacion: string

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone'})
    createdAt: Date

    @Column({ name: 'autorizar_date', type: 'timestamp with time zone', nullable: true})
    autorizarDate: Date

    //-----Tablas Padre--------

    //Autoriza el traslado de productos.
    @ManyToOne(()=> Empleado, empleado=> empleado.trasladoRes)
    @JoinColumn({ name: "responsable_id"})
    responsable:Empleado

    @ManyToOne(() => Sucursal, sucursal => sucursal.trasladoRes)
    @JoinColumn({ name: "responsable_sucursal_id"})
    sucursalResp: Sucursal;

    //El que solicita el producto.
    @ManyToOne(() => Empleado, (empleado) => empleado.trasladoSol)
    @JoinColumn({ name: "solicitador_id"})
    solicitador:Empleado

    @ManyToOne(() => Sucursal, sucursal => sucursal.trasladoSol)
    @JoinColumn({ name: "solicitador_sucursal_id"})
    sucursalSol: Sucursal;

    //-------Tablas Hijas--------
    @OneToMany(
        () => DetalleTraslado,
        detalle_traslado => detalle_traslado.traslado,
        {
            cascade: ["insert", "update", "remove"]
        })
    detalle: DetalleTraslado[];

    @Column({ type: 'varchar', length: 45, default: 'PENDIENTE'})
    status: string

    @OneToOne(() => Envio, (envio) => envio.traslado,  {
        nullable: true
    })
    envio: Envio
}
