import { Column, Entity, 
        PrimaryGeneratedColumn, 
        CreateDateColumn, 
        OneToMany} 
from 'typeorm';
import {Puesto} from "src/recursos-humanos/puesto/entity/puesto.entity"


@Entity('departamento')
export class Departamento {
    @PrimaryGeneratedColumn()
    id:number

    @Column({ type: 'varchar', length: 50,nullable: false })
    nombre: string;

    @Column({type:'bool',default:true})
    estado:boolean

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @OneToMany(
      type => Puesto, 
      puesto => puesto.departamento,
      { cascade: true },
      )
    puesto: Puesto[];
}

