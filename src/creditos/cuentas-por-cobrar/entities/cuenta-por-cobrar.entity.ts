import { Sucursal } from "src/sucursal/entity/sucursal.entity";
import { Cliente } from "src/ventas/cliente/entity/cliente.entity"
import { Venta } from "src/ventas/venta/entity/venta.entity"
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { CuentaPorCobrarDetalle } from './cuenta-por-cobrar-details.entity';

@Entity('cuentas_por_cobrar')
export class CuentaPorCobrar {
    @PrimaryGeneratedColumn({name: 'id_cuentas_por_cobrar'})
    id?: number

    @CreateDateColumn({ name: 'fecha_inicio', type: 'timestamp' })
    fechaInicio?:Date

    @Column({ name: 'fecha_final', type: 'date' })
    fechaFinal?:Date

    @Column({type:'bool',default:false})
    estado?:boolean

    @ManyToOne(()=> Cliente, cliente => cliente.cuentaPorCobrar)
    cliente?:Cliente

    @OneToOne(()=> Venta, venta => venta.cuentaPorCobrar)
    @JoinColumn()
    venta?:Venta

    @OneToMany(()=> CuentaPorCobrarDetalle, cuentaPorCobrarDetalle => cuentaPorCobrarDetalle.cuentaPorCobrar, {
        cascade: true
    })
    cuentaPorCobrarDetalle?:CuentaPorCobrarDetalle[]

    @ManyToOne(() => Sucursal, sucursal => sucursal.cuentaPorCobrar)
    sucursal?: Sucursal;
}
