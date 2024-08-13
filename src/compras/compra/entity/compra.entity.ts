import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';
import { Proveedor } from '../../proveedor/entity/proveedor.entity';
import { DetalleCompra } from './detalle-compra.entity';
import { Sucursal } from 'src/sucursal/sucursal/entity/sucursal.entity';
import { CuentaPorPagar } from 'src/creditos/cuentas-por-pagar/entities/cuenta-por-pagar-entity';
import { Pago } from 'src/finanzas/pago/entities/pago.entity';


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
    
    @OneToMany(() => Pago, (Pago) => Pago.compra) // specify inverse side as a second parameter
    pago?: Pago []
}