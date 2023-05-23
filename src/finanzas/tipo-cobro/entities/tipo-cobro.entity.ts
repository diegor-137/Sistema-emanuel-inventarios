import { DetalleCobro } from "src/finanzas/cobro/entities/detalle-cobro";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";


@Entity('tipo_cobro')
export class TipoCobro {


    @PrimaryColumn({name: 'id_tipo_cobro'})
    id: number

    @Column({ type: 'varchar', length: 45, nullable: false })
    nombre: string;

    //Tablas Hijas
    /*********Cobro*********/

    @OneToMany(() => DetalleCobro, detalleCobro => detalleCobro.cobro)
    detalleCobro: DetalleCobro[];
}
