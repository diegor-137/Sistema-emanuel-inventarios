import { Caja } from "src/finanzas/caja/entities/caja.entity";
import { Cobro } from "src/finanzas/cobro/entities/cobro.entity";
import { CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from 'typeorm';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';
import { CorteCajaDetalle } from './corte-caja-detalle';
import { Gasto } from '../../gastos/entities/gasto.entity';


@Entity('corte_caja')
export class CorteCaja {
/* 
    @PrimaryGeneratedColumn()
    id:number

    @CreateDateColumn({ name: 'fecha', type: 'timestamp' })
    fechas:Date

    @ManyToOne(() => Caja, (caja) => caja.corteCaja)
    caja:Caja

    @Column({type:"decimal",precision:6,scale:2})
    monto:number

    @Column({type:"decimal",precision:6,scale:2})
    balance:number

    @Column({type: 'varchar', length: 45, nullable: false})
    tipoMovimiento:string

    //-------Tablas Hijas--------

    @OneToMany(() => Cobro, Cobro => Cobro.corteCaja, {
        nullable: true
    })
    cobro: Cobro[];

    @OneToMany(()=> CorteCajaDetalle, corteCajaDetalle => corteCajaDetalle.corteCaja)
    corteCajaDetalle: CorteCajaDetalle[]

    //-------Tablas Padre--------

    @ManyToOne(()=> Empleado, empleado=> empleado.corteCaja)
    empleado:Empleado */

    
    @PrimaryGeneratedColumn()
    id:number

    @CreateDateColumn({ name: 'fecha', type: 'timestamp' })
    fechas:Date

    @Column({ type: 'varchar', length: 350, default: '', nullable: true })
    observacion: string

    @ManyToOne(() => Caja, (caja) => caja.corteCaja)
    caja:Caja

    //-------Tablas Hijas--------


    @OneToMany(()=> CorteCajaDetalle, corteCajaDetalle => corteCajaDetalle.corteCaja, {
        cascade: ["insert", "update", "remove"]
    })
    corteCajaDetalle: CorteCajaDetalle[]

    @OneToMany(() => Cobro, Cobro => Cobro.corteCaja, {
        nullable: true
    })
    cobro: Cobro[];

    @OneToMany(() => Gasto, gasto => gasto.corteCaja, {
        nullable: true
    })
    gasto: Gasto[];

    //-------Tablas Padre--------

    @ManyToOne(()=> Empleado, empleado=> empleado.corteCaja)
    empleado:Empleado
    

}
