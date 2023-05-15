import { Compra } from "src/compras/compra/entity/compra.entity";
import { Sucursal } from "src/sucursal/entity/sucursal.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Proveedor } from '../../../compras/proveedor/entity/proveedor.entity';
import { CuentaPorPagarDetalle } from "./cuenta-por-pagar-details.entity";

@Entity('cuentas_por_pagar')
export class CuentaPorPagar {

    @PrimaryGeneratedColumn({name: 'id_cuentas_por_pagar'})
    id?: number

    @CreateDateColumn({ name: 'fecha_inicio', type: 'date' })
    fechaInicio?:Date

    @Column({ name: 'fecha_final', type: 'date' })
    fechaFinal:Date

    @Column({type:'bool',default:false})
    estado?:boolean

    @ManyToOne(()=> Proveedor, proveedor => proveedor.cuentaPorPagar)
    proveedor:Proveedor

    @OneToOne(()=> Compra, compra => compra.cuentaPorPagar)
    @JoinColumn()
    compra:Compra

    @OneToMany(()=> CuentaPorPagarDetalle, cuentaPorPagarDetalle=> cuentaPorPagarDetalle.cuentaPorPagar, {
        cascade: true
    })
    cuentaPorPagarDetalle:CuentaPorPagarDetalle[]

    @ManyToOne(() => Sucursal, sucursal => sucursal.cuentaPorPagar)
    sucursal?: Sucursal;

}

