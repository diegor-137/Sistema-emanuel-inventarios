import { Injectable, NotFoundException } from "@nestjs/common";
import { Inventario } from "../entities/inventario.entity";
import { getRepository, Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { Sucursal } from '../../../sucursal/sucursal/entity/sucursal.entity';
import { User } from "src/user/entities/user.entity";
import { InventarioDto } from "../dto/inventario.dto";
import { Propagation, Transactional } from "typeorm-transactional-cls-hooked";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class InventarioService{
    constructor(
        @InjectRepository(Inventario)
        public readonly repository:Repository<Inventario>
        ){}

    async findById(id:number){
        const data = await this.repository.findOne(id)
        if(!data) throw new NotFoundException(`El registro no fue encontrado`);
        return data;
    }

    async editOne(id:number, dto:InventarioDto){
        //return console.log(dto)
        const inventario = await this.findById(id)
        const Edited = Object.assign(inventario,dto)
        return await this.repository.save(Edited)
        }

    @Transactional({propagation:Propagation.MANDATORY})
    async afterCreateNewProd(dto:Producto){
        const sucRep = getRepository(Sucursal)
        const sucursal = await sucRep.find()

        for (let i = 0; i < sucursal.length; i++) { 
            await this.repository
            .createQueryBuilder()
            .insert()
            .values([
                {producto:dto,sucursal:sucursal[i]}
            ]).execute()
        }
        return
    }
    //consulta para el modulo de inventario
    async prodPorSucursal(user:User){
        return await getRepository(Inventario)
        .createQueryBuilder("inventario")
        .leftJoinAndSelect("inventario.producto","producto")
        .leftJoinAndSelect("producto.categoria","categoria")
        .leftJoinAndSelect("producto.marca","marca")
        .leftJoinAndSelect("producto.precio","precio")
        .leftJoinAndSelect("precio.tipoPrecio","tipoPrecio")
        .leftJoinAndSelect("inventario.sucursal","sucursal")
        .where("sucursal.id =:id",{id:user.empleado.sucursal.id})
        .getMany()
      }

      async getProductoSucursal(user:User,id:number){
        return await this.repository.findOne({
            where:{sucursal: user.empleado.sucursal.id,
                producto:id}})
      }

}
