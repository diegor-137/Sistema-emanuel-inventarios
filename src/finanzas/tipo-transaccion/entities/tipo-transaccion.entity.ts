import { CuentaPorCobrarDetalle } from "src/creditos/cuentas-por-cobrar/entities/cuenta-por-cobrar-details.entity";
import { CuentaPorPagarDetalle } from "src/creditos/cuentas-por-pagar/entities/cuenta-por-pagar-details.entity";
import { DetalleCobro } from "src/finanzas/cobro/entities/detalle-cobro";
import { DetallePago } from "src/finanzas/pago/entities/detalle-pago";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity('tipo_transaccion')
export class TipoTransaccion {


    @PrimaryColumn({name: 'id_tipo_transaccion'})
    id: number

    @Column({ type: 'varchar', length: 45, nullable: false })
    nombre: string;

    //Tablas Hijas
    /*********Cobro*********/

    @OneToMany(() => DetalleCobro, detalleCobro => detalleCobro.tipoTransaccion)
    detalleCobro: DetalleCobro[];

    @OneToMany(() => CuentaPorCobrarDetalle, cuentaPorCobrarDetalle => cuentaPorCobrarDetalle.tipoTransaccion,{
        nullable: true
    })
    cuentaPorCobrarDetalle: CuentaPorCobrarDetalle[];

    @OneToMany(() => CuentaPorPagarDetalle, cuentaPorPagarDetalle => cuentaPorPagarDetalle.tipoTransaccion,{
        nullable: true
    })
    cuentaPorPagarDetalle: CuentaPorPagarDetalle[];

    @OneToMany(() => DetallePago, detallePago => detallePago.tipoTransaccion,{
        nullable: true
    })
    detallePago: DetallePago[];
}
