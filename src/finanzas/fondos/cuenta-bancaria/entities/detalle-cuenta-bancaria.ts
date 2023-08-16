import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CuentaBancaria } from "./cuenta-bancaria";


@Entity('detalle_cuenta_bancaria')
export class DetalleCuentaBancaria {

    @PrimaryGeneratedColumn()
    id:number

    @Column({ type: 'varchar', length: 45, nullable: false })
    documento:string

    @Column({ type: 'varchar', length: 350, nullable: true })
    descripcion:string

    @Column({type:"decimal",precision:10,scale:2})
    cantidad:number

    //-----Tablas Padre--------
    /*********Cobro*********/
    @ManyToOne(() => CuentaBancaria, cuentaBancaria => cuentaBancaria.detalleCuentaBancaria,
    {
        onDelete:'CASCADE',
        orphanedRowAction:"delete"
    })
    @JoinColumn({ name: "id_cuenta_bancaria"})
    cuentaBancaria?: CuentaBancaria;

}