import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Producto } from '../../producto/entities/producto.entity';




@Entity('categoria')
export class Categoria {

    @PrimaryGeneratedColumn({name: 'id_categoria'})
    id: number

    @Column({type: 'varchar', length: 255, default: '', nullable: true})
    nombre: string

    @Column({ type: 'bool', default: true })
    estado: boolean

    @OneToMany(() => Producto, producto => producto.categoria)
    productos: Producto[];

}