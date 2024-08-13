import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CuentaPorPagar } from "./cuenta-por-pagar-entity";
import { TipoTransaccion } from "src/finanzas/tipo-transaccion/entities/tipo-transaccion.entity";



@Entity('cuentas_por_pagar_detalle')
export class CuentaPorPagarDetalle {

    @PrimaryGeneratedColumn({name: 'id_estado_cuenta'})
    id?: number

    @CreateDateColumn({ name: 'fecha', type: 'timestamp with time zone' })
    fecha?:Date

    @Column({type: 'varchar', length: 200, nullable: true})
    descripcion?:string

    @Column({type:"decimal",precision:10,scale:2})
    monto:number;

    @Column({type:"decimal",precision:10,scale:2})
    balance:number;

    @ManyToOne(()=> CuentaPorPagar, credito=> credito.cuentaPorPagarDetalle)
    cuentaPorPagar?:CuentaPorPagar
    
}