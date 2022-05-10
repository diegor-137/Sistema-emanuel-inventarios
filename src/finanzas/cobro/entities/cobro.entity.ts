import { Caja } from "src/finanzas/caja/entities/caja.entity";
import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity";
import { Venta } from "src/ventas/venta/entity/venta.entity";
import { CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { DetalleCobro } from "./detalle-cobro";


@Entity('cobro')
export class Cobro {

    @PrimaryGeneratedColumn()
    id:number

    @CreateDateColumn({ name: 'fecha', type: 'timestamp' })
    fecha:Date

    //-----Tablas Padre--------

    @OneToOne(() => Empleado, (empleado) => empleado.cobro)
    @JoinColumn({ name: "id_empleado"})
    empleado:Empleado

    @OneToOne(() => Venta, (venta) => venta.cobro)
    @JoinColumn({ name: "id_venta"})
    venta:Venta

    @OneToOne(() => Caja, (caja) => caja.cobro)
    @JoinColumn({ name: "id_caja"})
    caja:Caja

    //-------Tablas Hijas--------

    @OneToMany(() => DetalleCobro, detalleCobro => detalleCobro.cobro,
    {
        cascade: ["insert", "update", "remove"]
    })
    detalleCobro: DetalleCobro[];

}
