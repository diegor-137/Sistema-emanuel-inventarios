import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Caja } from '../../caja/entities/caja.entity';


@Entity('movimiento_caja')
export class MovimientoCaja {

    @PrimaryGeneratedColumn()
    id:number

    @CreateDateColumn({ name: 'fecha', type: 'timestamp' })
    fecha:Date

    @Column({type: 'varchar', length: 45, nullable: false})
    descripcion:string

    @Column({type:"decimal",precision:6,scale:2})
    monto:number;

    @Column({type:"decimal",precision:6,scale:2})
    balance:number;

    @ManyToOne(()=> Caja, caja=> caja.MovimientoCaja)
    caja:Caja

    @Column({type:"boolean", nullable: true})
    type: boolean;
}
