import { Proveedor } from 'src/compras/proveedor/entity/proveedor.entity';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';
import { Column, 
    CreateDateColumn, 
    Entity, 
    PrimaryGeneratedColumn, 
    ManyToOne, 
    OneToMany } from 'typeorm';
import { DetallePedido } from './detalle-pedido.entity';
import { Sucursal } from '../../../sucursal/entity/sucursal.entity';

@Entity('pedido')
export class Pedido{
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
            proveedor => proveedor.pedido,
            )
        proveedor: Proveedor;
    
        @ManyToOne(
            type => Empleado,
            empleado => empleado.pedido,
            )
        empleado: Empleado;

        @ManyToOne(
            type => Sucursal,
            sucursal => sucursal.pedido,
            )
        sucursal: Sucursal;
    
        //------Tablas Hijas---------
        @OneToMany(
            type => DetallePedido,
            detalle_pedido => detalle_pedido.pedido,
            {cascade:true}
            )
            detalle_pedido: DetallePedido[];
}