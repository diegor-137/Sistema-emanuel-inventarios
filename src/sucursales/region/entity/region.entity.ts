import { Costo } from "src/almacen/precio/entities/costo.entity";
import { Precio } from "src/almacen/precio/entities/precio.entity";
import { CuentaBancaria } from "src/finanzas/fondos/cuenta-bancaria/entities/cuenta-bancaria";
import { Sucursal } from "src/sucursal/sucursal/entity/sucursal.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('region')
export class Region{
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:'varchar',length:75,nullable:false})
    nombre:string

    @Column({type:'bool',default:true})
    estado:boolean

    /*************Sucursal************/
    @OneToMany(() => Sucursal, sucursal => sucursal.region,
    )
    sucursal:Sucursal[]

    @OneToMany(
        type => Precio,
        precio => precio.region,
    )
    precio:Precio

    @OneToMany(
        type => Costo,
        costo => costo.region,
    )
    costo:Costo

    @OneToMany(()=> CuentaBancaria, cuentaBancaria => cuentaBancaria.region)
    cuentaBancaria:CuentaBancaria[]
}