import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Caja } from '../../caja/entities/caja.entity';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';
import { CorteCaja } from '../../corte-caja/entities/corte-caja.entity';
import { FileAws3 } from '../../../files/entities/file.entity';
import { TipoGasto } from "src/finanzas/tipo-gasto/entities/tipo-gasto.entity";

@Entity('gastos')
export class Gasto {

    @PrimaryGeneratedColumn({name: 'id_gasto'})
    id: number

    @CreateDateColumn({ name: 'fecha', type: 'timestamp' })
    fecha:Date

    @Column({ name: 'deleted_at', nullable: true, type: 'timestamp with time zone' })
    deletedAt: Date;



    @Column({type: 'varchar', length: 45, nullable: false})
    descripcion:string

    @Column({type:"decimal",precision:6,scale:2})
    monto:number;

    @Column({type: 'varchar', length: 45, nullable: false})
    documento:number
    
    /* TABLAS PADRES */
    @ManyToOne(() => Caja, (caja) => caja.gastos)
    caja:Caja

    @ManyToOne(()=> Empleado, empleado=> empleado.gastos)
    empleado:Empleado

    @ManyToOne(()=> Empleado, empleado=> empleado.gastosDelete)
    deleteResponsible:Empleado

    @OneToOne(() => FileAws3, fileAws3 => fileAws3.gasto, {
        nullable: true
    })
    @JoinColumn({ name: "id_foto"})
    foto: FileAws3;

    @ManyToOne(()=> TipoGasto, (tipoGasto)=> tipoGasto.gasto,  {
        nullable: true
    })
    tipoGasto:TipoGasto

    @Column({type: 'varchar', length: 90, nullable: true})
    solicitante:string
}
