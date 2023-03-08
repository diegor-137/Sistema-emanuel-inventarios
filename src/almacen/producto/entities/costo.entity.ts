import { Region } from "src/sucursales/region/entity/region.entity";
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Producto } from "./producto.entity";

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

 @ManyToOne(type=> Region, region => region.costo)
 region: Region

 @ManyToOne(type=> Producto, producto => producto.costo)
 producto: Producto
}
