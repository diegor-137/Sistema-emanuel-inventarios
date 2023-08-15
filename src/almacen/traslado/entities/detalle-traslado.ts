import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Traslado } from "./traslado.entity";
import { Producto } from "src/almacen/producto/entities/producto.entity";


@Entity('detalle_traslado')
export class DetalleTraslado{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    cantidad:number
    
    @ManyToOne(
        () => Traslado,
        traslado => traslado.detalle,
        {onDelete:'CASCADE',
        orphanedRowAction:"delete"}
        )
    traslado: Traslado;
    
    @ManyToOne(() => Producto, producto => producto.detalle_venta)
    producto: Producto;
        
}