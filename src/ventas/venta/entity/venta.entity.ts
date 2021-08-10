import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Cliente } from '../../cliente/entity/cliente.entity';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';
import { DetalleVenta } from './detalle-venta.entity';
import { Sucursal } from '../../../sucursal/entity/sucursal.entity';

@Entity('venta')
export class Venta{
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:'varchar',length:350,nullable:true})
    observacion:string
  
    @Column({type:'bool',default:true})
    estado:boolean

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date

        //-----Tablas Padre--------
        @ManyToOne(
            type => Cliente,
            cliente => cliente.venta,
            )
        cliente: Cliente;
    
        @ManyToOne(
            type => Empleado,
            empleado => empleado.venta,
            )
        empleado: Empleado;

        @ManyToOne(
            type => Sucursal,
            sucursal => sucursal.venta,
            )
        sucursal: Sucursal;

        //-------Tablas Hijas--------
        @OneToMany(
            type => DetalleVenta,
            detalle_venta => detalle_venta.venta,
            {cascade:["insert","update","remove"]
        })
            detalle_venta: DetalleVenta[];
}