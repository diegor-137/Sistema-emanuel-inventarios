import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pago } from "./pago.entity";
import { TipoTransaccion } from "src/finanzas/tipo-transaccion/entities/tipo-transaccion.entity";

@Entity('detalle_pago')
export class DetallePago {
    @PrimaryGeneratedColumn()
    id:number

    @Column({ type: 'varchar', length: 350, nullable: true })
    descripcion:string

    @Column({type:"decimal",precision:10,scale:2})
    monto:number

    //-----Tablas Padre--------
    /*********pago*********/
    @ManyToOne(() => Pago, pago => pago.detallePago,
    {
        onDelete:'CASCADE',
        orphanedRowAction:"delete"
    })
    @JoinColumn({ name: "id_pago"})
    pago: Pago;

    /*********Tipo pago*********/
    @ManyToOne(() => TipoTransaccion, tipoTransaccion => tipoTransaccion.detallePago)
    @JoinColumn({ name: "id_tipo_transaccion"})
    tipoTransaccion:TipoTransaccion;
}