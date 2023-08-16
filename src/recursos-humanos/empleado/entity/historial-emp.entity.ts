import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Empleado } from "./empleado.entity";

@Entity('historial-emp')
export class historialEmp{
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:'varchar',length:15,nullable:false})
    accion:string

    @Column({type:'varchar',length:150,nullable:false})
    motivo:string

    @CreateDateColumn({name:'created_at',type:'timestamp'})
    createdAt:Date;

    @Column({type:'varchar',length:50,nullable:false})
    usuario:string;

    /*********Empleado*********/
    @ManyToOne(
        type => Empleado,
        empleado => empleado.historialemp,
        )
    empleado: Empleado
}