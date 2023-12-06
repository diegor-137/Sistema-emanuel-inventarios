import { type } from "node:os";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';
import { Compra } from '../../../compras/compra/entity/compra.entity';
import { Cotizacion } from '../../../ventas/cotizacion/entity/cotizacion.entity';
import { Venta } from '../../../ventas/venta/entity/venta.entity';
import { Pedido } from '../../../compras/pedido/entity/pedido-entity';
import { Inventario } from '../../../almacen/producto/entities/inventario.entity';
import { Region } from "src/sucursales/region/entity/region.entity";
import { Caja } from "src/finanzas/caja/entities/caja.entity";
import { FileAws3 } from "src/files/entities/file.entity";
import { CreditoCliente } from "src/creditos/credito-cliente/entities/credito-cliente.entity";
import { CuentaPorPagar } from "src/creditos/cuentas-por-pagar/entities/cuenta-por-pagar-entity";
import { CuentaPorCobrar } from "src/creditos/cuentas-por-cobrar/entities/cuenta-por-cobrar.entity";
import { Kardex } from "src/almacen/kardex/entity/kardex.entity";
import { Traslado } from "src/almacen/traslado/entities/traslado.entity";
import { Envio } from "src/almacen/envio/entities/envio.entity";
import { CuentaBancaria } from "src/finanzas/fondos/cuenta-bancaria/entities/cuenta-bancaria";
import { Efectivo } from "src/finanzas/fondos/efectivo/entities/efectivo.entity";
import { ConfiguracionesGlobal } from "src/configuraciones/configuraciones-global/entities/configuraciones-global.entity";
import { Gasto } from "src/finanzas/gastos/entities/gasto.entity";

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
    
    //Tablas Padre

    /*****************************/
    @ManyToOne(() => Region, region => region.sucursal,
    )
    region: Region

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

    @OneToMany(()=>Kardex, kardex => kardex.sucursal)
    kardex:Kardex[]
    /*********Traslados*********/

    @OneToMany(() => Traslado, (traslado) => traslado.sucursalResp)
    trasladoRes:Traslado[]

    @OneToMany(() => Traslado, (traslado) => traslado.solicitador)
    trasladoSol:Traslado[]

    /*********Envios*********/
    @OneToMany(() => Envio, (envio) => envio.sucursalDespachador)
    envioSucursalDespachador:Envio[]

    @OneToMany(() => Envio, (traslado) => traslado.sucursalRecepcionador)
    envioSucursalRecepcionador:Envio[]

    /*********Envios*********/

    @OneToMany(()=> Efectivo, efectivo => efectivo.sucursal)
    efectivo:Efectivo[]

    @OneToMany(()=> Gasto, gasto => gasto.sucursal)
    gasto:Gasto[]

    @OneToMany(()=> ConfiguracionesGlobal, configuracionesGlobal => configuracionesGlobal.sucursal)
    configuracionesGlobal:ConfiguracionesGlobal[]
}