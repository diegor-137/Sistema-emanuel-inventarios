import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('configuracion-global')
export class ConfiguracionesGlobal {

    @PrimaryGeneratedColumn({name: 'id'})
    id: number

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({type:'bool'})
    checked:boolean

}
