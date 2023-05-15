import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';
import { Proveedor } from '../../proveedor/entity/proveedor.entity';
import { DetalleCompra } from './detalle-compra.entity';
<<<<<<< HEAD
import { Sucursal } from '../../../sucursal/sucursal/entity/sucursal.entity';
=======
import { Sucursal } from '../../../sucursal/entity/sucursal.entity';
import { CuentaPorPagar } from 'src/creditos/cuentas-por-pagar/entities/cuenta-por-pagar-entity';
>>>>>>> 3e93f6973e995cceaf378b6e1d9d368b19f01cee


@Entity('compra')
export class Compra{
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:'varchar',length:20,nullable:true})
    documento:string

    @Column({type:'varchar',length:350,nullable:true})
    observacion:string
  
    @Column({type:'bool',default:false})
    estado:boolean

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
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

    @OneToOne(()=> CuentaPorPagar, cuentaPorPagar =>cuentaPorPagar.compra)
    cuentaPorPagar:CuentaPorPagar    
}