import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Producto } from './producto.entity';
import { TipoPrecio } from '../../tipo-precio/entities/tipo-precio.entity';


@Entity('precios')
export class Precio {

    @PrimaryGeneratedColumn({name: 'id_precio'})
    id:number

    @Column({type: 'decimal', default: 0, precision:6,scale:2})
    precio:number

    @Column({ type: 'bool', default: true })
    estado:boolean

    @ManyToOne(()=> Producto, producto => producto.precio, {
        onDelete: "CASCADE",
        orphanedRowAction: "delete"        
    })
    producto:Producto

    @ManyToOne(()=> TipoPrecio, tipoPrecio => tipoPrecio.precio)
    tipoPrecio: TipoPrecio
}