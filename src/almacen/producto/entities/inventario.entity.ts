import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Producto } from './producto.entity';
import { Sucursal } from '../../../sucursal/entity/sucursal.entity';


@Entity('inventario')
export class Inventario {

    @PrimaryGeneratedColumn({name: 'id_precio'})
    id:number

    @Column({type: 'int', default: 0, nullable: true })
    cantidad:number

    //@Column({type:"decimal",precision:6,scale:2})
    //costo_promedio:number

    //@Column({type:"decimal",precision:6,scale:2})
    //ultimo_precio:number


    @ManyToOne(type=> Producto, producto => producto.inventario, {
        onDelete: "CASCADE",
        orphanedRowAction: "delete"        
    })
    producto:Producto

    @ManyToOne(type=> Sucursal, sucursal => sucursal.inventario)
    sucursal: Sucursal
}