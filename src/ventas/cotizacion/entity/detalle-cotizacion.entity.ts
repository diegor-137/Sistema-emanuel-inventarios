import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Producto } from '../../../almacen/producto/entities/producto.entity';
import { Cotizacion } from './cotizacion.entity';

@Entity('detalle_cotizacion')
export class DetalleCotizacion{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    cantidad:number
    
    @Column({type:"decimal",precision:6,scale:2})
    precio:number

    @ManyToOne(
        type => Cotizacion,
        cotizacion => cotizacion.detalle_cotizacion,
        {onDelete:'CASCADE',
        orphanedRowAction:"delete"}
        )
    cotizacion: Cotizacion;

    @ManyToOne(
        type => Producto,
        producto => producto.detalle_cotizacion,
        )
    producto: Producto;
}