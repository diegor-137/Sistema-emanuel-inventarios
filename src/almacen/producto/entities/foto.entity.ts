import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Producto } from './producto.entity';



@Entity('fotos')
export class Foto {
    
    @PrimaryGeneratedColumn({name: 'id_producto'})
    id:number

    @Column()
    nombre:string

    @ManyToOne(()=> Producto, producto => producto.fotos)
    producto?: Producto;

}