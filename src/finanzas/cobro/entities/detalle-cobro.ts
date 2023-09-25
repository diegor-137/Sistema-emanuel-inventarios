import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Cobro } from "./cobro.entity";
import { Banco } from "src/finanzas/fondos/bancos/entities/banco.entity";
import { CuentaBancaria } from "src/finanzas/fondos/cuenta-bancaria/entities/cuenta-bancaria";
import { TipoTransaccion } from "src/finanzas/tipo-transaccion/entities/tipo-transaccion.entity";


@Entity('detalle_cobro')
export class DetalleCobro {

    @PrimaryGeneratedColumn()
    id:number

    @Column({ type: 'varchar', length: 350, nullable: true })
    descripcion:string

    @Column({type:"decimal",precision:10,scale:2})
    monto:number

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
    @ManyToOne(() => TipoTransaccion, tipoTransaccion => tipoTransaccion.detalleCobro)
    @JoinColumn({ name: "id_tipo_transaccion"})
    tipoTransaccion:TipoTransaccion;
}