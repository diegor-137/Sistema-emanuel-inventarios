import { Inventario } from "src/almacen/producto/entities/inventario.entity";
import { Producto } from "src/almacen/producto/entities/producto.entity";
import { EntitySubscriberInterface, EventSubscriber, getRepository, InsertEvent, LoadEvent, UpdateEvent } from "typeorm";
import { Compra } from "../entity/compra.entity";

@EventSubscriber()
export class CompraSubscriber
implements EntitySubscriberInterface<Compra>{
    listenTo() {
        return Compra
    }

    async afterInsert(event: LoadEvent<Compra>){
/*         await event.queryRunner.commitTransaction();
        await event.queryRunner.startTransaction();
        const productoRepository = getRepository(Producto)
        const inventarioRepository = getRepository(Inventario)
        //console.log(event.entity.detalle)
        for (let i = 0; i < event.entity.detalle.length; i++) {

            //console.log(event.entity.detalle[i])
            const inventario = await inventarioRepository.find({
            where:{sucursal: event.entity.sucursal.id,producto:event.entity.detalle[i].producto}})
            inventario[0].cantidad = (+event.entity.detalle[0].cantidad) + (+inventario[0].cantidad)
            await inventarioRepository.save(inventario)
            //console.log(inventario)
            const producto:any = await productoRepository.find({
                where:{id:event.entity.detalle[i].producto}
            })
            producto[0].costo_prom_old = +producto[0].costo_prom
            producto[0].ultimo_precio = event.entity.detalle[i].precio
            producto[0].costo_prom = ((+producto[0].costo_prom) + (+event.entity.detalle[i].precio))/2
            await productoRepository.save(producto)
            //console.log(producto)

            
        }
        return */
    }

    async afterUpdate(event: UpdateEvent<Compra>){
/*         await event.queryRunner.commitTransaction();
        await event.queryRunner.startTransaction();
        const productoRepository = getRepository(Producto)
        const inventarioRepository = getRepository(Inventario)

        for (let i = 0; i < event.entity.detalle.length; i++) {
            const inventario = await inventarioRepository.find({
                where:{sucursal:event.entity.sucursal.id,producto:event.entity.detalle[i].producto}
            })
            inventario[0].cantidad = (+inventario[0].cantidad) - (event.entity.detalle[i].cantidad)
            await inventarioRepository.save(inventario)

            const producto:any = await productoRepository.find({
                where:{id:event.entity.detalle[i].producto}
            })
            producto[0].ultimo_precio = +producto[0].costo_prom_old
            producto[0].costo_prom = +producto[0].costo_prom_old
            await productoRepository.save(producto)
        } */
    }
}