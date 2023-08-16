import { Producto } from "src/almacen/producto/entities/producto.entity";
import { Sucursal } from "src/sucursal/sucursal/entity/sucursal.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('kardex')
export class Kardex{
    @PrimaryGeneratedColumn({name: 'id_kardex'})
    id: number

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @Column({type: 'varchar', length: 35, nullable: true})
    concepto: string

    @Column()
    transaccion: number

    @Column()
    cantidad: number

    @Column()
    nuevaCantidad: number

    @ManyToOne(()=>Sucursal, sucursal=>sucursal.kardex)
    sucursal:Sucursal

    @ManyToOne(()=>Producto, producto=>producto.kardex)
    producto:Producto
}