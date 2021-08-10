import { Producto } from 'src/almacen/producto/entities/producto.entity';
import { Column, 
    Entity, 
    PrimaryGeneratedColumn, 
    ManyToOne } from 'typeorm';
import { Pedido } from './pedido-entity';

@Entity('detalle_pedido')
export class DetallePedido{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    cantidad:number
    
    @Column({type:"decimal",precision:6,scale:2})
    precio:number

    @ManyToOne(
        type => Pedido,
        pedido => pedido.detalle_pedido,
        {onDelete:'CASCADE',
        orphanedRowAction:"delete"}
        )
    pedido: Pedido;

    @ManyToOne(
        type => Producto,
        producto => producto.detalle_pedido,
        )
    producto: Producto;
}