import { Gasto } from "src/finanzas/gastos/entities/gasto.entity";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('tipo_gasto')
export class TipoGasto {


    @PrimaryGeneratedColumn({name: 'id_tipo_gasto'})
    id: number

    @Column({ type: 'varchar', length: 80, nullable: false })
    nombre: string;

    @OneToMany(() => Gasto, gasto => gasto.tipoGasto)
    gasto: Gasto[];

}
