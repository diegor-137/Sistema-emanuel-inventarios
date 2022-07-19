import { Caja } from "src/finanzas/caja/entities/caja.entity";
import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity";
import { Venta } from "src/ventas/venta/entity/venta.entity";
import { CreateDateColumn, Entity, EntityRepository, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { DetalleCobro } from "./detalle-cobro";
import { CorteCaja } from '../../corte-caja/entities/corte-caja.entity';


@Entity('cobro')
export class Cobro {

    @PrimaryGeneratedColumn()
    id:number

    @CreateDateColumn({ name: 'fecha', type: 'timestamp' })
    fecha:Date

    //-----Tablas Padre--------

    @ManyToOne(() => Empleado, (empleado) => empleado.cobro)
    @JoinColumn({ name: "id_empleado"})
    empleado:Empleado

    @OneToOne(() => Venta, (venta) => venta.cobro)
    @JoinColumn({ name: "id_venta"})
    venta:Venta

    @ManyToOne(() => Caja, (caja) => caja.cobro)
    @JoinColumn({ name: "id_caja"})
    caja:Caja
    
    @ManyToOne(()=> CorteCaja, (corteCaja)=> corteCaja.cobro)
    corteCaja:CorteCaja

    //-------Tablas Hijas--------

    @OneToMany(() => DetalleCobro, detalleCobro => detalleCobro.cobro,
    {
        cascade: ["insert", "update", "remove"]
    })
    detalleCobro: DetalleCobro[];




}
