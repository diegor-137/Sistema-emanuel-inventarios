import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Efectivo } from "./efectivo.entity";
import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity";


@Entity('detalle_efectivo')
export class DetalleEfectivo {

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
    @ManyToOne(() => Efectivo, efectivo => efectivo.detalleEfectivo,
    {
        onDelete:'CASCADE',
        orphanedRowAction:"delete"
    })
    @JoinColumn({ name: "id_efectivo"})
    efectivo?: Efectivo;

    @Column({type:"boolean", nullable: true})
    type: boolean;

    @ManyToOne(() => Empleado, (empleado) => empleado.detalleEfectivo)
    @JoinColumn({ name: "id_empleado"})
    empleado:Empleado
    
}