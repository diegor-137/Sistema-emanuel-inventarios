import { Producto } from "src/almacen/producto/entities/producto.entity";
import { Region } from "src/sucursales/region/entity/region.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('costo')
export class Costo {
    @PrimaryGeneratedColumn()
    id:number

    @Column({type: 'decimal',  default: 0, precision:6,scale:2})
    costo_prom:number
   
    @Column({type: 'decimal',  default: 0, precision:6,scale:2})
    costo_prom_old:number
   
    @Column({type: 'decimal',  default: 0, precision:6,scale:2})
    ultimo_precio:number

    @ManyToOne(()=>Region, region => region.costo,{
    })
    region:Region

    @ManyToOne(()=>Producto, producto => producto.costo,{
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        orphanedRowAction:"delete"
    })
    producto:Producto
}