
import { DetalleCompra } from "src/compras/compra/entity/detalle-compra.entity";
import { DetallePedido } from "src/compras/pedido/entity/detalle-pedido.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Categoria } from '../../categoria/entity/categoria.entity';
import { Marca } from '../../marca/entities/marca.entity';
import { Foto } from './foto.entity';

import { DetalleVenta } from '../../../ventas/venta/entity/detalle-venta.entity';
import { DetalleCotizacion } from '../../../ventas/cotizacion/entity/detalle-cotizacion.entity';
import { Inventario } from './inventario.entity';
import { Costo } from "src/almacen/precio/entities/costo.entity";
import { Precio } from "src/almacen/precio/entities/precio.entity";
import { Kardex } from "src/almacen/kardex/entity/kardex.entity";
import { DetalleTraslado } from "src/almacen/traslado/entities/detalle-traslado";


@Entity('productos')
export class Producto {
    @PrimaryGeneratedColumn({name: 'id_producto'})
    id: number

    @Column({ type: 'varchar', length: 55})
    nombre: string

    @Column({ type: 'varchar', length: 255, nullable: true})
    descripcion: string

    @Column({name: 'codigo_barras',type: 'int', default: 0, nullable: true })
    codigoBarras: number

    @Column({ type: 'bool', default: true })
    estado: boolean

    @Column({type: 'decimal', default: 0, precision:6,scale:2,nullable: true })
    costo_prom:number

    @Column({type: 'decimal', default: 0, precision:6,scale:2,nullable: true})
    costo_prom_old:number

    @Column({type: 'decimal', default: 0, precision:6,scale:2, nullable: true})
    ultimo_precio:number

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    //Tablas Padre
 
    @ManyToOne(() => Categoria, categoria => categoria.productos,{
    })
    categoria: Categoria;
    

    @ManyToOne(() => Marca, marca => marca.productos)
    marca: Marca;

    //Tablas Hijas
    @OneToMany(()=> Foto, foto => foto.producto, {
        cascade: true
    })
    fotos : Foto[];

    @OneToMany(()=> Precio, precio => precio.producto, {
        cascade: true
    })
    precio : Precio[];

    @OneToMany(
        type => Costo,
        costo => costo.producto, {
            cascade:true
        }
    )
    costo:Costo[]


    @OneToMany(
        type=> Inventario, 
        inventario => inventario.producto,
        {cascade:["insert","update"]
        })
    inventario : Inventario[];

    @OneToMany(()=>Kardex, kardex=>kardex.producto)
    kardex:Kardex

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

    @OneToMany(
        ()=> DetalleTraslado, 
        detalle_traslado => detalle_traslado.producto, 
        {
            cascade: true})
    detalle_traslado : DetalleTraslado[]
}
