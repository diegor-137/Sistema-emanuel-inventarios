import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cobro } from "./cobro.entity";


@Entity('detalle_cobro')
export class DetalleCobro {

    @PrimaryGeneratedColumn()
    id:number

    @Column({ type: 'varchar', length: 350, nullable: true })
    descripcion:string

    @Column({type:"decimal",precision:6,scale:2})
    cantidad:number

    //-----Tablas Padre--------

    @ManyToOne(() => Cobro, cobro => cobro.detalleCobro,
    {
        onDelete:'CASCADE',
        orphanedRowAction:"delete"
    })
    @JoinColumn({ name: "id_cobro"})
    cobro: Cobro;
}