import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity"
import { Sucursal } from "src/sucursal/sucursal/entity/sucursal.entity"
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { DetalleEfectivo } from "./detalle-efectivo"
import { ConfiguracionesGlobal } from "src/configuraciones/configuraciones-global/entities/configuraciones-global.entity"
import { Caja } from "src/finanzas/caja/entities/caja.entity"

@Entity('efectivo')
export class Efectivo {
    @PrimaryGeneratedColumn()
    id:number

    @CreateDateColumn({ name: 'fecha', type: 'timestamp with time zone' })
    fecha?:Date

    @Column({type: 'varchar', length: 45, nullable: false})
    nombre?:string

    //-----Tablas Padre--------

    @ManyToOne(() => Empleado, (empleado) => empleado.efectivo)
    @JoinColumn({ name: "id_empleado"})
    empleado?:Empleado

    @ManyToOne(() => Sucursal, (sucursal) => sucursal.efectivo)
    @JoinColumn({ name: "id_sucursal"})
    sucursal?:Sucursal

    //-------Tablas Hijas--------

    @OneToMany(() => DetalleEfectivo, detalleEfectivo => detalleEfectivo.efectivo,
    {
        cascade: ["insert", "update", "remove"]
    })
    detalleEfectivo?: DetalleEfectivo[];

    @Column({ type: 'boolean', default: true})
    estado?: boolean    
    @Column({ type: 'boolean', default: false})
    cajaUse?: boolean  
    
    @OneToOne(()=>Caja, caja =>caja.efectivo, {
        cascade:true
    })
    caja?:Caja
}
