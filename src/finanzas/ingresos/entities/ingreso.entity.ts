import { Caja } from "src/finanzas/caja/entities/caja.entity"
import { CorteCaja } from "src/finanzas/corte-caja/entities/corte-caja.entity"
import { Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';

@Entity('ingreso')
export class Ingreso {

    @PrimaryGeneratedColumn()
    id:number

    @Column({ name: 'deleted_at', nullable: true, type: 'timestamp with time zone' })
    deletedAt: Date;
    
    @CreateDateColumn({ name: 'fecha', type: 'timestamp' })
    fecha:Date

    @Column({ type: 'varchar', length: 255, nullable: true })
    descripcion:string

    @Column({type:"decimal",precision:9,scale:2})
    monto:number

    @ManyToOne(() => Caja, (caja) => caja.ingreso)
    @JoinColumn({ name: "id_caja"})
    caja:Caja

    @ManyToOne(()=> CorteCaja, (corteCaja)=> corteCaja.ingreso)
    corteCaja:CorteCaja

}
