import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Precio } from '../../producto/entities/precio.entity';


@Entity('tipo_precio')
export class TipoPrecio {

    @PrimaryGeneratedColumn()
    id:number

    @Column({ type: 'varchar', length: 255, default: '', nullable: true })
    nombre:String

    @OneToMany(()=>Precio , precio => precio.tipoPrecio)
    precio: Precio[]

}