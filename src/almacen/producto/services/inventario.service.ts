import { Injectable } from "@nestjs/common";
import { DataService } from '../../../common/service/common.service';
import { Inventario } from "../entities/inventario.entity";
import { CreateCompraDto } from '../../../compras/compra/dto/create-compra.dto';
import { getRepository } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { CreateVentaDto } from "src/ventas/venta/dto/create-venta.dto";
import { Sucursal } from '../../../sucursal/entity/sucursal.entity';
import { User } from "src/user/entities/user.entity";
import { InventarioDto } from "../dto/inventario.dto";

@Injectable()
export class InventarioService extends DataService(Inventario){


    async Ingreso(dto:CreateCompraDto){
        //return console.log('object :>> ', dto.detalle);
        const productoRepository = getRepository(Producto)
        for (let i = 0; i < dto.detalle.length; i++) {  

            const inventario = await this.repository.find({
                where:{sucursal: dto.sucursal.id,producto:dto.detalle[i].producto}})
            inventario[0].cantidad = dto.detalle[i].cantidad + inventario[0].cantidad
            await this.repository.save(inventario)


            const producto = await productoRepository.find({
                where:{id:dto.detalle[i].producto}})
            //console.log('object :>> ',producto);
            //console.log('object :>> ', dto.detalle_compra[i].precio);
            //console.log('object :>> ', productos);
            producto[0].costo_prom_old = +producto[0].costo_prom
            producto[0].ultimo_precio = dto.detalle[i].precio
            producto[0].costo_prom = ((+producto[0].costo_prom) + (+dto.detalle[i].precio))/2
            await productoRepository.save(producto)
        }
    }

    async Egreso(dto:CreateVentaDto){
        for (let i = 0; i < dto.detalle.length; i++) {
            const productos = dto.detalle[i]
            const inventario = await this.repository.find({
                where:{sucursal: dto.sucursal.id,producto:productos.producto}
            })
            inventario[0].cantidad =inventario[0].cantidad - dto.detalle[i].cantidad
            await this.repository.save(inventario)
        }
    }

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
          
/*         return await getRepository(Inventario)
        .createQueryBuilder("inventario")
        .leftJoinAndSelect("inventario.producto","producto")
        .leftJoinAndSelect("producto.categoria","categoria")
        .leftJoinAndSelect("producto.marca","marca")
        .leftJoinAndSelect("producto.precio","precio")
        .leftJoinAndSelect("precio.tipoPrecio","tipoPrecio")
        .leftJoinAndSelect("inventario.sucursal","sucursal")
        //.where("sucursal.id =:id",{id:user.empleado.sucursal.id})
        .andWhere("producto.id =:id",{id:id})
        .getOne() */
      }

      async editOne(id:number, dto:InventarioDto){
        //return console.log(dto)
        const inventario = await this.findById(id)
        const Edited = Object.assign(inventario,dto)
        return await this.repository.save(Edited)
      }
}
