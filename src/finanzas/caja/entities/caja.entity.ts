import { Cobro } from "src/finanzas/cobro/entities/cobro.entity";
import { MovimientoCaja } from "src/finanzas/movimiento-caja/entities/movimiento-caja.entity";
import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CorteCaja } from '../../corte-caja/entities/corte-caja.entity';
import { Gasto } from '../../gastos/entities/gasto.entity';
import { Ingreso } from '../../ingresos/entities/ingreso.entity';
import { Egreso } from '../../egresos/entities/egreso.entity';
import { Sucursal } from '../../../sucursal/entity/sucursal.entity';


@Entity('caja')
export class Caja {

    @PrimaryGeneratedColumn({name: 'id_caja'})
    id: number

    @Column({ type: 'varchar', length: 255, nullable: false})
    lugar: string;

    @Column({ type: 'varchar', length: 45, nullable: false, default: 'ACTIVO'})
    estado: string

    @CreateDateColumn({ name: 'fecha', type: 'timestamp' })
    fecha:Date
    
    @Column({ name: 'deleted_at', nullable: true, type: 'timestamp with time zone' })
    deletedAt: Date;

    @Column({type:'bool',default:true})
    status:boolean
    //Tablas Padre
    /*********Cobro*********/
    @OneToOne(() => Empleado, (empleado) => empleado.caja)
    @JoinColumn({ name: "id_empleado"})
    empleado:Empleado

    @ManyToOne(()=> Sucursal, sucursal => sucursal.caja)
    sucursal: Sucursal
    
    //Tablas Hijas
    /*********Cobro*********/
    @OneToMany(() => Cobro, (cobro) => cobro.caja)
    cobro: Cobro[]

    @OneToMany(() => CorteCaja, (CorteCaja) => CorteCaja.caja)
    corteCaja:CorteCaja[]

    @OneToMany(() => MovimientoCaja, (MovimientoCaja) => MovimientoCaja.caja)
    MovimientoCaja:MovimientoCaja[]

    @OneToMany(() => Gasto, (gasto) => gasto.caja)
    gastos:Gasto[]

    @OneToMany(() => Ingreso, (ingreso) => ingreso.caja)
    ingreso:Ingreso[]

    @OneToMany(() => Egreso, (egreso) => egreso.caja)
    egreso:Egreso[]

}
