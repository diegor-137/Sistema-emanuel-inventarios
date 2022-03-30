import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';
import { Proveedor } from '../../proveedor/entity/proveedor.entity';
import { DetalleCompra } from './detalle-compra.entity';
import { Sucursal } from '../../../sucursal/entity/sucursal.entity';


@Entity('compra')
export class Compra{
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:'varchar',length:20,nullable:true})
    documento:string

    @Column({type:'varchar',length:350,nullable:true})
    observacion:string
  
    @Column({type:'bool',default:true})
    estado:boolean

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date


    //-----Tablas Padre--------
    @ManyToOne(
        type => Proveedor,
        proveedor => proveedor.compra,
        )
    proveedor: Proveedor;

    @ManyToOne(
        type => Empleado,
        empleado => empleado.compra,
        )
    empleado: Empleado;

    @ManyToOne(
        type => Sucursal,
        sucursal => sucursal.compra,
        )
    sucursal: Sucursal;

    //------Tablas Hijas---------
    @OneToMany(
        type => DetalleCompra,
        detalle => detalle.compra,
        {cascade:["insert","update","remove"]
    })
        detalle: DetalleCompra[];
}