import { Traslado } from "src/almacen/traslado/entities/traslado.entity"
import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity"
import { Sucursal } from "src/sucursal/sucursal/entity/sucursal.entity"
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity('envio')
export class Envio {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 350, nullable: true })
    observacionEnvio: string

    @Column({ type: 'varchar', length: 350, nullable: true })
    observacionRecepcion: string

    @CreateDateColumn({ name: 'fecha_inico', type: 'timestamp with time zone'})
    fechaInicio: Date

    @Column({ name: 'fecha_fin', type: 'timestamp with time zone', nullable: true})
    fechaFin: Date

    @OneToOne(() => Traslado, (traslado) => traslado.envio)
    @JoinColumn()
    traslado: Traslado

    //-----Tablas Padre--------
    @ManyToOne(()=> Empleado, empleado=> empleado.envioDespachador)
    @JoinColumn({ name: "despachador_id"})
    despachador:Empleado

    @ManyToOne(() => Empleado, (empleado) => empleado.envioRecepcionador)
    @JoinColumn({ name: "recepcionador_id"})
    recepcionador:Empleado

    @ManyToOne(() => Sucursal, sucursal => sucursal.envioSucursalDespachador)
    @JoinColumn({ name: "sucursal_despachador_id"})
    sucursalDespachador: Sucursal;

    @ManyToOne(() => Sucursal, sucursal => sucursal.envioSucursalRecepcionador)
    @JoinColumn({ name: "sucursal_recepcionador_id"})
    sucursalRecepcionador: Sucursal;

    @Column({ type: 'varchar', length: 45, default: 'PENDIENTE'})
    status: string

}
