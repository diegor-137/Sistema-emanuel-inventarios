import { type } from "node:os";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Empleado } from '../../recursos-humanos/empleado/entity/empleado.entity';
import { Compra } from '../../compras/compra/entity/compra.entity';
import { Cotizacion } from '../../ventas/cotizacion/entity/cotizacion.entity';
import { Venta } from '../../ventas/venta/entity/venta.entity';
import { Pedido } from '../../compras/pedido/entity/pedido-entity';
import { Inventario } from '../../almacen/producto/entities/inventario.entity';
import { Caja } from "src/finanzas/caja/entities/caja.entity";
import { FileAws3 } from "src/files/entities/file.entity";
import { CuentaPorCobrar } from '../../creditos/cuentas-por-cobrar/entities/cuenta-por-cobrar.entity';
import { CreditoCliente } from "src/creditos/credito-cliente/entities/credito-cliente.entity";
import { CuentaPorPagar } from "src/creditos/cuentas-por-pagar/entities/cuenta-por-pagar-entity";

@Entity('sucursal')
export class Sucursal{
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:'varchar',length:75,nullable:false})
    nombre:string

    @Column({type:'varchar',length:125,nullable:true})
    direccion:string

    @Column({type:'bool',default:true})
    estado:boolean    
    
    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
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

    @OneToMany(()=> Caja, caja => caja.sucursal)
    caja:Caja[]

    @OneToOne(() => FileAws3, fileAws3 => fileAws3.sucursal, {
        nullable: true
    })
    @JoinColumn({ name: "id_foto"})
    foto: FileAws3;

    @OneToMany(()=> CuentaPorCobrar, cuentaPorCobrar => cuentaPorCobrar.sucursal)
    cuentaPorCobrar:CuentaPorCobrar[]

    @OneToMany(()=> CuentaPorPagar, cuentaPorPagar => cuentaPorPagar.sucursal)
    cuentaPorPagar:CuentaPorPagar[]

    @OneToMany(() => CreditoCliente, credito => credito.sucursal)
    credito:CreditoCliente[]
}