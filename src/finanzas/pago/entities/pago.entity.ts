import { Compra } from "src/compras/compra/entity/compra.entity";
import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DetallePago } from "./detalle-pago";

@Entity('pago')
export class Pago {

    @PrimaryGeneratedColumn()
    id:number

    @CreateDateColumn({ name: 'fecha', type: 'timestamp with time zone' })
    fecha:Date

    @Column({ name: 'deleted_at', nullable: true, type: 'timestamp with time zone' })
    deletedAt: Date;

    //-----Tablas Padre--------

    @ManyToOne(() => Empleado, (empleado) => empleado.pago)
    @JoinColumn({ name: "id_empleado"})
    empleado:Empleado

    @OneToOne(() => Compra, (compra) => compra.pago)
    @JoinColumn({ name: "id_compra"})
    compra:Compra

    //-------Tablas Hijas--------

    @OneToMany(() => DetallePago, detallePago => detallePago.pago,
    {
        cascade: ["insert", "update", "remove"]
    })
    detallePago: DetallePago[];

}
