import { Precio } from "src/almacen/precio/entities/precio.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('tipo_precio')
export class TipoPrecio {

    @PrimaryGeneratedColumn({name:'id_tipo_precio'})
    id:number

    @Column({ type: 'varchar', length: 255, default: '', nullable: true })
    nombre:String

    @Column({type:'bool', default:true})
    estado:boolean

    @OneToMany(()=>Precio , precio => precio.tipoPrecio)
    precio: Precio[]

}