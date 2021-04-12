import { Producto } from 'src/almacen/producto/entities/producto.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Compra } from './compra.entity';


@Entity('detalle_compra')
export class DetalleCompra{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    cantidad:number
    
    @Column()
    precio:number
  
    @Column()
    estado:boolean

    @ManyToOne(
        type => Compra,
        compra => compra.detalle_compra,
        )
    compra: Compra;

    @ManyToOne(
        type => Producto,
        producto => producto.detalle_compra,
        )
    producto: Producto;
}