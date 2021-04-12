import { Compra } from '../../compra/entity/compra.entity';
import { Column, 
        CreateDateColumn, 
        Entity, 
        OneToMany, 
        PrimaryGeneratedColumn} 
from 'typeorm';

@Entity('proveedor')
export class Proveedor{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column({type:'varchar',length:100,nullable:false})
    nombre:string

    @Column({type:'varchar',length:125,nullable:true})
    direccion:string

    @Column({type:'varchar',length:15,nullable:true})
    telefono:string

    @Column({type:'varchar',length:12,nullable:true})
    nit:string

    @Column({type:'varchar',length:30,nullable:true})
    correo:string

    @Column({type:'bool',default:true})
    estado:boolean

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date

    @OneToMany(
        type => Compra,
        compra => compra.proveedor,
        )
        compra: Compra;
}