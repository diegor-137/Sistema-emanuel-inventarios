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

        const productoRepository = getRepository(Producto)
        for (let i = 0; i < dto.detalle_compra.length; i++) {  
            const productos = dto.detalle_compra[i]


            const inventario = await this.repository.find({
                where:{sucursal: dto.sucursal.id,producto:productos.producto}})
            inventario[0].cantidad = dto.detalle_compra[i].cantidad + inventario[0].cantidad
            await this.repository.save(inventario)


            const producto = await productoRepository.find({
                where:{id:productos.producto}})
            producto[0].costo_prom_old = producto[0].costo_prom
            producto[0].ultimo_precio = productos.precio
            producto[0].costo_prom = (+producto[0].costo_prom + producto[0].ultimo_precio)/2
            await productoRepository.save(producto)
        }
    }

    async Egreso(dto:CreateVentaDto){
        for (let i = 0; i < dto.detalle_venta.length; i++) {
            const productos = dto.detalle_venta[i]
            const inventario = await this.repository.find({
                where:{sucursal: dto.sucursal.id,producto:productos.producto}
            })
            inventario[0].cantidad =inventario[0].cantidad - dto.detalle_venta[i].cantidad
            await this.repository.save(inventario)
        }
    }

}
