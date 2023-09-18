import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { InventarioService } from 'src/almacen/producto/services/inventario.service';
import { ListGeneralProd, ListKardex } from '../interfaces/almacenReporte-interfaces';
import { getRepository } from 'typeorm';
import { Kardex } from 'src/almacen/kardex/entity/kardex.entity';

@Injectable()
export class InventarioReportService {
    constructor(
        private readonly invetnarioService:InventarioService
    ){}
    
    //Esta consulta llama a un listado general de productos y su inventario 
    //pero solo llama por sucursal, la sucursal en la que este el usuario
    async findAll(user:User){
        const data = await this.invetnarioService.repository
        .createQueryBuilder('inventario')
        .leftJoinAndSelect("inventario.producto","producto")
        .leftJoinAndSelect("inventario.sucursal","sucursal")
        .select(["inventario.cantidad as cantidad","producto.id as productoId","producto.nombre as producto",
        "sucursal.nombre as sucursal"])
        .where("sucursal.id =:id",{id:user.empleado.sucursal.id})
        .andWhere("producto.estado = true")
        .groupBy("inventario.cantidad, producto.id,sucursal.nombre")
        .orderBy("producto.id")
        .getRawMany()
        
    const listGeneralInventario:ListGeneralProd = {
      header:{
        documento: 'Listado de Inventario por Sucursal',
        sucursal:{
        nombre:user.empleado.sucursal.nombre,
        direccion:user.empleado.direccion
      },
      empleado:{
        nombre:user.empleado.nombre,
        apellido:user.empleado.apellido
      },
      },
      resultado:data
    }
    return listGeneralInventario
    }

    async findPorRegion(user:User){
        const data = await this.invetnarioService.repository
        .createQueryBuilder('inventario')
        .leftJoinAndSelect("inventario.producto","producto")
        .leftJoinAndSelect("inventario.sucursal","sucursal")
        .leftJoinAndSelect("sucursal.region","region")
        .select(["inventario.cantidad as cantidad","producto.id as productoId","producto.nombre as producto",
        "sucursal.nombre as sucursal","region.nombre as region"])
        .where("sucursal.id =:id",{id:user.empleado.sucursal.id})
        .andWhere("producto.estado = true")
        .groupBy("producto.id,sucursal.nombre,region.nombre,inventario.cantidad")
        .orderBy("producto.id")
        .getRawMany()

        const listGeneralInventario:ListGeneralProd = {
        header:{
          documento: 'Listado de Inventario por Region',
          sucursal:{
          nombre:user.empleado.sucursal.nombre,
          direccion:user.empleado.direccion
        },
        empleado:{
          nombre:user.empleado.nombre,
          apellido:user.empleado.apellido
        },
        },
        resultado:data
      }
      return listGeneralInventario
    }

    async kardexPorRegion(start:Date,end:Date, user:User, dto:any){
      const st = new Date(start)
      const en = new Date(end);
      en.setDate(en.getDate() + 1);
      console.log(dto)
      var reg = user.empleado.sucursal.region.id
      const data = getRepository(Kardex)
      .createQueryBuilder('kardex')
      .leftJoinAndSelect("kardex.sucursal","sucursal")
      .leftJoinAndSelect("sucursal.region","region")
      .leftJoinAndSelect("kardex.producto","producto")
      .andWhere("region.id=:id",{id:reg})
      .andWhere("kardex.created_at>=:st",{st})
      .andWhere("kardex.created_at<:en",{en})
      if(dto.producto)data.andWhere("kardex.producto.id = :idProd",{idProd:dto.producto.id})

      const resultado = await data.getMany()
    
      const resultKardexRegion:ListKardex = {
        header:{
          documento: 'Kardex por Region',
          sucursal:{
          nombre:user.empleado.sucursal.nombre,
          direccion:user.empleado.direccion
        },
        empleado:{
          nombre:user.empleado.nombre,
          apellido:user.empleado.apellido
        },
        periodo:`${new Date(start).toLocaleDateString("es-gt") } - ${new Date(end).toLocaleDateString("es-gt")}`
        },
        resultado:resultado

      }

      return resultKardexRegion;
    }

    async kardexPorSucursal(start:Date,end:Date, user:User, dto:any){
      const st = new Date(start)
      const en = new Date(end);
      en.setDate(en.getDate() + 1);
      console.log(dto)
      var suc = user.empleado.sucursal.id
      const data = getRepository(Kardex)
      .createQueryBuilder('kardex')
      .leftJoinAndSelect("kardex.sucursal","sucursal")
      .leftJoinAndSelect("kardex.producto","producto")
      .andWhere("sucursal.id=:id",{id:suc})
      .andWhere("kardex.created_at>=:st",{st})
      .andWhere("kardex.created_at<:en",{en})
      if(dto.producto)data.andWhere("kardex.producto.id = :idProd",{idProd:dto.producto.id})

      const resultado = await data.getMany()
    
      const resultKardexSucursal:ListKardex = {
        header:{
          documento: 'Kardex por Sucursal',
          sucursal:{
          nombre:user.empleado.sucursal.nombre,
          direccion:user.empleado.direccion
        },
        empleado:{
          nombre:user.empleado.nombre,
          apellido:user.empleado.apellido
        },
        periodo:`${new Date(start).toLocaleDateString("es-gt") } - ${new Date(end).toLocaleDateString("es-gt")}`
        },
        resultado:resultado

      }

      return resultKardexSucursal;
    }
}














