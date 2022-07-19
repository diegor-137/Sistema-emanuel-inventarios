import { Cobro } from "src/finanzas/cobro/entities/cobro.entity";
import { MovimientoCaja } from "src/finanzas/movimiento-caja/entities/movimiento-caja.entity";
import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CorteCaja } from '../../corte-caja/entities/corte-caja.entity';
import { Gasto } from '../../gastos/entities/gasto.entity';


@Entity('caja')
export class Caja {

    @PrimaryGeneratedColumn({name: 'id_caja'})
    id: number

    @Column({ type: 'varchar', length: 255, nullable: false})
    lugar: string;

    @Column({ type: 'varchar', length: 45, nullable: false, default: 'ACTIVO'})
    estado: string  

    //Tablas Padre
    /*********Cobro*********/
    @ManyToOne(() => Empleado, (empleado) => empleado.caja)
    @JoinColumn({ name: "id_empleado"})
    empleado:Empleado
    
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

}
