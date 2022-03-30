import { Injectable } from "@nestjs/common";
import { DataService } from '../../common/service/common.service';
import { Inventario } from "./entities/inventario.entity";
import { CreateCompraDto } from '../../compras/compra/dto/create-compra.dto';
import { getRepository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateVentaDto } from "src/ventas/venta/dto/create-venta.dto";
import { Sucursal } from '../../sucursal/entity/sucursal.entity';

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

    async productoVenta(){
        return await this.repository.find({
            where: {
                
            },
            relations: [
                'producto',
                'producto.categoria', 
                'producto.marca',
                'producto.precio',
                'producto.precio.tipoPrecio',
                "producto.inventario",
                'producto.inventario.sucursal']
            });
      }

}
