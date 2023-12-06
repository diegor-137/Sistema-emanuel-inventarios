import { Caja } from "src/finanzas/caja/entities/caja.entity";
import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity";
import { Venta } from "src/ventas/venta/entity/venta.entity";
import { Column, CreateDateColumn, Entity, EntityRepository, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

import { DetalleCuentaBancaria } from "./detalle-cuenta-bancaria";
import { Sucursal } from "src/sucursal/sucursal/entity/sucursal.entity";
import { Region } from "src/sucursales/region/entity/region.entity";
import { Banco } from "../../bancos/entities/banco.entity";


@Entity('cuenta_bancaria')
export class CuentaBancaria {

    @PrimaryGeneratedColumn()
    id:number

    @CreateDateColumn({ name: 'fecha', type: 'timestamp with time zone' })
    fecha?:Date

    @Column({type: 'varchar', length: 45, nullable: false, unique:true})
    numero?: string

    @Column({type: 'varchar', length: 45, nullable: false})
    nombre?:string

    //-----Tablas Padre--------

    @ManyToOne(() => Empleado, (empleado) => empleado.cuentaBancaria)
    @JoinColumn({ name: "id_empleado"})
    empleado?:Empleado

    @ManyToOne(() => Region, (region) => region.cuentaBancaria)
    @JoinColumn({ name: "id_region"})
    region?:Region

    //-------Tablas Hijas--------

    @OneToMany(() => DetalleCuentaBancaria, detalleCuentaBancaria => detalleCuentaBancaria.cuentaBancaria,
    {
        cascade: ["insert", "update", "remove"]
    })
    detalleCuentaBancaria?: DetalleCuentaBancaria[];

    @Column({ type: 'boolean', default: true})
    estado?: string

    @ManyToOne(() => Banco, banco => banco.cuentaBancaria)
    @JoinColumn({ name: "id_banco"})
    banco?:Banco;

}
