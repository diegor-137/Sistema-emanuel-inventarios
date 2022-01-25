import { Producto } from "src/almacen/producto/entities/producto.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('marca')
export class Marca {

    @PrimaryGeneratedColumn({name: 'id_marca'})
    id: number

    @Column({type: 'varchar', length: 25, nullable: true})
    nombre: string

    @Column({ type: 'bool', default: true })
    estado: boolean
  
    @OneToMany(() => Producto, producto => producto.marca,{
    })
    productos: Producto[];

}
