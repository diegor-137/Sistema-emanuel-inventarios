import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('costo')
export class Costo {
    @PrimaryGeneratedColumn()
    id:number

    @Column({type: 'decimal', default: 0, precision:6,scale:2,nullable: true })
    costo_prom:number
   
    @Column({type: 'decimal', default: 0, precision:6,scale:2,nullable: true})
    costo_prom_old:number
   
    @Column({type: 'decimal', default: 0, precision:6,scale:2, nullable: true})
    ultimo_precio:number
}