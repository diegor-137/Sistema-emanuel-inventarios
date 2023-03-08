import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Producto } from './producto.entity';
import { Sucursal } from '../../../sucursal/sucursal/entity/sucursal.entity';


@Entity('inventario')
export class Inventario {

    @PrimaryGeneratedColumn({name: 'id'})
    id:number

    @Column({type: 'int', default: 0, nullable: true })
    cantidad:number

    @ManyToOne(type=> Producto, producto => producto.inventario, {
        onDelete: "CASCADE",
        orphanedRowAction: "delete"        
    })
    producto:Producto

    @ManyToOne(type=> Sucursal, sucursal => sucursal.inventario)
    sucursal: Sucursal
}