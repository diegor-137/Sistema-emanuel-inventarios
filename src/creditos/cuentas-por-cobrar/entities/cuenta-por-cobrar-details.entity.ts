import { Caja } from "src/finanzas/caja/entities/caja.entity";
import { CorteCaja } from "src/finanzas/corte-caja/entities/corte-caja.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CuentaPorCobrar } from './cuenta-por-cobrar.entity';
import { TipoTransaccion } from "src/finanzas/tipo-transaccion/entities/tipo-transaccion.entity";

@Entity('cuentas_por_cobrar_detalle')
export class CuentaPorCobrarDetalle {
    
    @PrimaryGeneratedColumn({name: 'id_cuentas_por_cobrar_detalle'})
    id?: number

    @CreateDateColumn({ name: 'fecha', type: 'timestamp with time zone' })
    fecha?:Date

    @Column({type: 'varchar', length: 100, nullable: true})
    descripcion?:string

    @Column({type:"decimal",precision:10,scale:2})
    monto:number;

    @Column({type:"decimal",precision:10,scale:2})
    balance:number;

    @ManyToOne(()=> CuentaPorCobrar, cuentaPorCobrar=> cuentaPorCobrar.cuentaPorCobrarDetalle)
    cuentaPorCobrar?:CuentaPorCobrar

    @ManyToOne(()=> CorteCaja, (corteCaja)=> corteCaja.cuentaPorCobrarDetalle)
    corteCaja?:CorteCaja

    @ManyToOne(() => Caja, (caja) => caja.cuentaPorCobrarDetalle)
    @JoinColumn({ name: "id_caja"})
    caja?:Caja

    @ManyToOne(() => TipoTransaccion, tipoTransaccion => tipoTransaccion.cuentaPorCobrarDetalle)
    @JoinColumn({ name: "id_tipo_transaccion"})
    tipoTransaccion:TipoTransaccion;
}