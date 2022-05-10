import { Cobro } from "src/finanzas/cobro/entities/cobro.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('caja')
export class Caja {

    @PrimaryGeneratedColumn({name: 'id_caja'})
    id: number

    @Column({ type: 'varchar', length: 255, nullable: false })
    lugar: string;
    
    //Tablas Hijas
    /*********Cobro*********/
    @OneToOne(() => Cobro, (cobro) => cobro.caja)
    cobro: Cobro

}
