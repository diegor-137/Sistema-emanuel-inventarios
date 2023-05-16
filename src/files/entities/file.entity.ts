import { Empleado } from 'src/recursos-humanos/empleado/entity/empleado.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Gasto } from '../../finanzas/gastos/entities/gasto.entity';
import { Sucursal } from 'src/sucursal/sucursal/entity/sucursal.entity';
 
@Entity()
export class FileAws3 {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column()
  public url: string;
 
  @Column()
  public key: string;

  @OneToOne(() => Empleado,empleado => empleado.foto)
  empleado: Empleado;

  @OneToOne(() => Gasto,gasto => gasto.foto)
  gasto: Gasto;

  @OneToOne(() => Sucursal, sucursal => sucursal.foto)
  sucursal: Sucursal;

    
}