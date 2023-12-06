import { CuentaBancaria } from "src/finanzas/fondos/cuenta-bancaria/entities/cuenta-bancaria";
import { Efectivo } from "src/finanzas/fondos/efectivo/entities/efectivo.entity";
import { Sucursal } from "src/sucursal/sucursal/entity/sucursal.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('configuracion-global')
export class ConfiguracionesGlobal {

    @PrimaryGeneratedColumn({name: 'id'})
    id: number
    
    @ManyToOne(()=> Sucursal, sucursal => sucursal.configuracionesGlobal)
    sucursal:Sucursal

    @OneToOne(() => Efectivo, {
        nullable:true
    })
    @JoinColumn({name: 'id_efectivo'})
    efectivo: Efectivo

    @OneToOne(() => CuentaBancaria, {
        nullable:true
    })
    @JoinColumn({name: 'id_cuenta_bancaria'})
    cuentaBancaria: CuentaBancaria

    @Column({ name:'venta_cobro',type: 'bool', default: false })
    ventaCobro: boolean

}
