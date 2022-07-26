import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CorteCaja } from './corte-caja.entity';


@Entity('corte_caja_detalle')
export class CorteCajaDetalle {

    @PrimaryGeneratedColumn()
    id:number

    @Column({type:"decimal",precision:10,scale:2})
    monto: number

    @Column({ type: 'varchar', length: 350, nullable: true })
    concepto: string
  
    @Column({type:"boolean"})
    type: boolean;

    @ManyToOne(()=> CorteCaja, corteCaja => corteCaja.corteCajaDetalle)
    corteCaja: CorteCaja

}