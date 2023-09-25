import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { CuentaBancaria } from "../../cuenta-bancaria/entities/cuenta-bancaria";

@Entity('bancos')
export class Banco {

    @PrimaryGeneratedColumn({name: 'id_banco'})
    id: number

    @Column({ type: 'varchar', length: 45, nullable: false })
    nombre: string;

    @OneToMany(() => CuentaBancaria, cuentaBancaria => cuentaBancaria.banco)
    cuentaBancaria: CuentaBancaria[];

}
