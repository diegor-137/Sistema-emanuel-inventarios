import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity() 
export class TransactionEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({type:"decimal",precision:4,scale:2})
  message: number
}
