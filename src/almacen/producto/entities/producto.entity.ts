import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Categoria } from '../../categoria/entity/categoria.entity';
import { Marca } from '../../marca/entities/marca.entity';
import { Foto } from './foto.entity';


@Entity('productos')
export class Producto {
    @PrimaryGeneratedColumn({name: 'id_producto'})
    id: number

    @Column({ type: 'varchar', length: 255, default: '', nullable: true })
    descripcion: string

    @Column({name: 'codigo_barras',type: 'int', default: 0, nullable: true })
    codigoBarras: number

    @Column({ type: 'varchar', length: 255, default: '', nullable: true })
    foto : string

    @Column({ type: 'bool', default: true })
    estado: boolean

    @ManyToOne(() => Categoria, categoria => categoria.productos)
    categoria: Categoria;
    
    @ManyToOne(() => Marca, marca => marca.productos)
    marca: Marca;

    @OneToMany(()=> Foto, foto => foto.producto, {
        cascade: true
    })
    fotos : Foto[];
}
