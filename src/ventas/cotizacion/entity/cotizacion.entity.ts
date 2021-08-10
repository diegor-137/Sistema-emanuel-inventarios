import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Cliente } from '../../cliente/entity/cliente.entity';
import { Empleado } from '../../../recursos-humanos/empleado/entity/empleado.entity';
import { DetalleCotizacion } from './detalle-cotizacion.entity';
import { Sucursal } from '../../../sucursal/entity/sucursal.entity';

@Entity('cotizacion')
export class Cotizacion{
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
            cliente => cliente.cotizacion,
            )
        cliente: Cliente;
    
        @ManyToOne(
            type => Empleado,
            empleado => empleado.cotizacion,
            )
        empleado: Empleado;

        @ManyToOne(
            type => Sucursal,
            sucursal => sucursal.cotizacion,
            )
        sucursal: Sucursal;

        //-------Tablas Hijas--------
        @OneToMany(
            type => DetalleCotizacion,
            detalle_cotizacion => detalle_cotizacion.cotizacion,
            {cascade:true
        })
            detalle_cotizacion: DetalleCotizacion[];
}