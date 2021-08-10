import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeRemove } from 'typeorm';
import { Venta } from './venta.entity';
import { Producto } from '../../../almacen/producto/entities/producto.entity';

@Entity('detalle_venta')
export class DetalleVenta{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    cantidad:number
    
    @Column({type:"decimal",precision:6,scale:2})
    precio:number

    @ManyToOne(
        type => Venta,
        venta => venta.detalle_venta,
        {onDelete:'CASCADE',
        orphanedRowAction:"delete"}
        )
    venta: Venta;
    @ManyToOne(
        type => Producto,
        producto => producto.detalle_venta,
        )
        producto: Producto;
        
}