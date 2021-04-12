import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Puesto } from '../../puesto/entity/puesto.entity';
import { Compra } from '../../../compras/compra/entity/compra.entity';

@Entity('empleado')
export class Empleado{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({type:'varchar',length:75,nullable:false})
    nombre:string

    @Column({type:'varchar',length:125,nullable:true})
    direccion:string

    @Column({type:'varchar',length:15,nullable:true})
    telefono:string

    @Column({type:'bool',default:true})
    estado:boolean

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    //Tablas Padre
    @ManyToOne(
        type => Puesto,
        puesto => puesto.empleado,
        )
    puesto: Puesto;
    
    //Tablas Hijas
    @OneToMany(
        type => Compra,
        compra => compra.empleado,
        )
        compra: Compra;
}