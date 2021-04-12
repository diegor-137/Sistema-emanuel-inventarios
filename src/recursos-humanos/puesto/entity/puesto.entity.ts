import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import {Departamento} from "src/recursos-humanos/departamento/entity/departamento.entity"
import { Empleado } from '../../empleado/entity/empleado.entity';

@Entity('puesto')
export class Puesto {
    @PrimaryGeneratedColumn()
    id:number

    @Column({ type: 'varchar', length: 50, nullable: false})
    nombre:string
    
    @Column({type:'bool',default:true})
    estado:boolean

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date

    @ManyToOne(
        type => Departamento,
        departamento => departamento.puesto,
        )
    departamento: Departamento;

    @OneToMany(
        type => Empleado,
        empleado => empleado.puesto,
        )
        empleado: Empleado;
    }
