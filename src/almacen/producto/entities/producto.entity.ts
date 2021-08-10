import { DetalleCompra } from "src/compras/compra/entity/detalle-compra.entity";
import { DetallePedido } from "src/compras/pedido/entity/detalle-pedido.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Categoria } from '../../categoria/entity/categoria.entity';
import { Marca } from '../../marca/entities/marca.entity';
import { Foto } from './foto.entity';
import { Precio } from './precio.entity';
import { DetalleVenta } from '../../../ventas/venta/entity/detalle-venta.entity';
import { DetalleCotizacion } from '../../../ventas/cotizacion/entity/detalle-cotizacion.entity';


@Entity('productos')
export class Producto {
    @PrimaryGeneratedColumn({name: 'id_producto'})
    id: number

    @Column({ type: 'varchar', length: 255, default: '', nullable: true })
    descripcion: string

    @Column({name: 'codigo_barras',type: 'int', default: 0, nullable: true })
    codigoBarras: number

    @Column({ type: 'bool', default: true })
    estado: boolean

    //Tablas Padre
    @ManyToOne(() => Categoria, categoria => categoria.productos)
    categoria: Categoria;
    
    @ManyToOne(() => Marca, marca => marca.productos)
    marca: Marca;


    //Tablas Hijas
    @OneToMany(()=> Foto, foto => foto.producto, {
        cascade: true
    })
    fotos : Foto[];


    //---------Compras-------------
    @OneToMany(
        ()=> DetalleCompra, 
        detalle_compra => detalle_compra.producto, 
        {
            cascade: true})
    detalle_compra : DetalleCompra

    @OneToMany(
        ()=> DetallePedido, 
        detalle_pedido => detalle_pedido.producto, 
        {
            cascade: true})
    detalle_pedido : DetallePedido

    ///---------Ventas------------
    @OneToMany(
        ()=> DetalleVenta, 
        detalle_venta => detalle_venta.producto, 
        {
            cascade: true})
    detalle_venta : DetalleVenta

    @OneToMany(
        ()=> DetalleCotizacion, 
        detalle_cotizacion => detalle_cotizacion.producto, 
        {
            cascade: true})
    detalle_cotizacion : DetalleCotizacion

}
