import { hash } from 'bcryptjs';
import Permission from 'src/auth/enums/permission.type';
import { Empleado } from 'src/recursos-humanos/empleado/entity/empleado.entity';
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {

    @PrimaryGeneratedColumn({name: 'id_user'})
    id: number

    @Column({ type: 'varchar', length: 255, nullable: false })
    user: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;

    @Column({type:'varchar', length: 128, nullable: false, default:true, select:false})
    password: string;
    
    @OneToOne(() => Empleado, (empleado) => empleado.user)
    @JoinColumn()
    empleado: Empleado

    @Column("text", {default: "{}", array:true })
    roles: string[];

    @Column({type: 'enum', enum: Permission, array: true, default: []})
    permissions: Permission[]


    @BeforeInsert()
      @BeforeUpdate()
      async hashPassword(){
          if(!this.password){
              return;
          }
          this.password = await hash(this.password, 10);
      }

}
