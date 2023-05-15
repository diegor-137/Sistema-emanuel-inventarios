import { Producto } from "src/almacen/producto/entities/producto.entity"
import { TipoPrecio } from "src/almacen/tipo-precio/entities/tipo-precio.entity"
import { Region } from "src/sucursales/region/entity/region.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"


@Entity('precios')
export class Precio {

    @PrimaryGeneratedColumn({name: 'id_precio'})
    id:number

    @Column({type: 'decimal', default: 0, precision:6,scale:2})
    precio:number

    @Column({ type: 'bool', default: true })
    estado:boolean

    /**********RELACIONES***********/
    @ManyToOne(()=> Producto, producto => producto.precio, {
        onDelete: "CASCADE",
        orphanedRowAction: "delete"        
    })
    producto:Producto

    @ManyToOne(()=> TipoPrecio, tipoPrecio => tipoPrecio.precio)
    tipoPrecio: TipoPrecio

    @ManyToOne(()=>Region, region => region.precio)
    region:Region
}