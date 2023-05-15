import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CuentaPorPagar } from "./cuenta-por-pagar-entity";



@Entity('cuentas_por_pagar_detalle')
export class CuentaPorPagarDetalle {

    @PrimaryGeneratedColumn({name: 'id_estado_cuenta'})
    id?: number

    @CreateDateColumn({ name: 'fecha', type: 'timestamp' })
    fecha?:Date

    @Column({type: 'varchar', length: 45, nullable: false})
    descripcion?:string

    @Column({type:"decimal",precision:10,scale:2})
    monto:number;

    @Column({type:"decimal",precision:10,scale:2})
    balance:number;

    @ManyToOne(()=> CuentaPorPagar, credito=> credito.cuentaPorPagarDetalle)
    cuentaPorPagar?:CuentaPorPagar
    
}