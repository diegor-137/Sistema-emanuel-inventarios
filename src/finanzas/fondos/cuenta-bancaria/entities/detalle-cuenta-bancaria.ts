import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CuentaBancaria } from "./cuenta-bancaria";
import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity";


@Entity('detalle_cuenta_bancaria')
export class DetalleCuentaBancaria {

    @PrimaryGeneratedColumn()
    id:number

    @CreateDateColumn({ name: 'fecha', type: 'timestamp with time zone'})
    fecha:Date

    @Column({ type: 'varchar', length: 45, nullable: false })
    documento:string

    @Column({ type: 'varchar', length: 350, nullable: true })
    descripcion:string

    @Column({type:"decimal",precision:10,scale:2})
    monto:number;

    @Column({type:"decimal",precision:10,scale:2})
    balance:number;

    //-----Tablas Padre--------
    /*********Cobro*********/
    @ManyToOne(() => CuentaBancaria, cuentaBancaria => cuentaBancaria.detalleCuentaBancaria,
    {
        onDelete:'CASCADE',
        orphanedRowAction:"delete"
    })
    @JoinColumn({ name: "id_cuenta_bancaria"})
    cuentaBancaria?: CuentaBancaria;

    @Column({type:"boolean", nullable: true})
    type: boolean;

    @ManyToOne(() => Empleado, (empleado) => empleado.detalleCuentaBancaria)
    @JoinColumn({ name: "id_empleado"})
    empleado:Empleado

}