import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cobro } from "./cobro.entity";
import { TipoCobro } from '../../tipo-cobro/entities/tipo-cobro.entity';


@Entity('detalle_cobro')
export class DetalleCobro {

    @PrimaryGeneratedColumn()
    id:number

    @Column({ type: 'varchar', length: 350, nullable: true })
    descripcion:string

    @Column({type:"decimal",precision:6,scale:2})
    cantidad:number

    //-----Tablas Padre--------
    /*********Cobro*********/
    @ManyToOne(() => Cobro, cobro => cobro.detalleCobro,
    {
        onDelete:'CASCADE',
        orphanedRowAction:"delete"
    })
    @JoinColumn({ name: "id_cobro"})
    cobro: Cobro;

    /*********Tipo Cobro*********/
    @ManyToOne(() => TipoCobro, tipoCobro => tipoCobro.detalleCobro)
    @JoinColumn({ name: "id_tipo_cobro"})
    tipoCobro:TipoCobro;
}