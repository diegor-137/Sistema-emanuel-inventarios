import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('compra')
export class Compra{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    fecha:Date
    
    
}