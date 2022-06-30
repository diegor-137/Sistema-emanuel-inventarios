import { DetalleCobro } from "src/finanzas/cobro/entities/detalle-cobro";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('tipo_cobro')
export class TipoCobro {


    @PrimaryGeneratedColumn({name: 'id_tipo_cobro'})
    id: number

    @Column({ type: 'varchar', length: 45, nullable: false })
    nombre: string;

    //Tablas Hijas
    /*********Cobro*********/

    @OneToMany(() => DetalleCobro, detalleCobro => detalleCobro.cobro)
    detalleCobro: DetalleCobro[];
}
