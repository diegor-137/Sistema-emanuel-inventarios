import { type } from "node:os";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Empleado } from '../../recursos-humanos/empleado/entity/empleado.entity';
import { Compra } from '../../compras/compra/entity/compra.entity';
import { Cotizacion } from '../../ventas/cotizacion/entity/cotizacion.entity';
import { Venta } from '../../ventas/venta/entity/venta.entity';
import { Pedido } from '../../compras/pedido/entity/pedido-entity';
import { Inventario } from '../../almacen/producto/entities/inventario.entity';

@Entity('sucursal')
export class Sucursal{
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:'varchar',length:75,nullable:false})
    nombre:string

    @Column({type:'bool',default:true})
    estado:boolean    
    
    //Tablas HIjas
    
    /********Recursos Humanos*******/
    @OneToMany(
        type => Empleado,
        empleado => empleado.sucursal
    )
    empleado:Empleado

    /********Compras*******/
    @OneToMany(
        type => Compra,
        compra => compra.sucursal
    )
    compra:Compra

    @OneToMany(
        type => Pedido,
        pedido => pedido.sucursal
    )
    pedido:Pedido

    /********Ventas*******/
    @OneToMany(
        type => Venta,
        venta => venta.sucursal
    )
    venta:Venta

    @OneToMany(
        type => Cotizacion,
        cotizacion => cotizacion.sucursal
    )
    cotizacion:Cotizacion

    /********Almacen*******/
    @OneToMany(
        type => Inventario,
        inventario => inventario.sucursal
    )
    inventario:Inventario
}