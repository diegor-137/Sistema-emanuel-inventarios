import { Inventario } from 'src/almacen/producto/entities/inventario.entity';
import { EntitySubscriberInterface, EventSubscriber, getRepository, InsertEvent, LoadEvent, Repository, UpdateEvent } from 'typeorm';
import { Venta } from '../entity/venta.entity';

@EventSubscriber()
export class ventaSubscriber 
implements EntitySubscriberInterface<Venta>{

    listenTo(){
        return Venta
    }

    async afterInsert(event:LoadEvent<Venta>){/* 
        await event.queryRunner.commitTransaction();
        await event.queryRunner.startTransaction();
        const inventarioRepository = getRepository(Inventario)
        
        for (let i = 0; i < event.entity.detalle.length; i++) {
            const inventario = await inventarioRepository.find({
                where:{sucursal:event.entity.sucursal.id,producto:event.entity.detalle[i].producto}
            })
            inventario[0].cantidad = (+inventario[0].cantidad) - (event.entity.detalle[i].cantidad)
            await inventarioRepository.save(inventario)
        }
        return */
    }

    async afterUpdate(event: UpdateEvent<Venta>){
       
    }
}
