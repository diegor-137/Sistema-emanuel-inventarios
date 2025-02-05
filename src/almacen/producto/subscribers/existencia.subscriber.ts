import { EntitySubscriberInterface, 
        EventSubscriber, 
        InsertEvent, 
        getRepository, 
        getConnection, 
        TransactionCommitEvent,
        LoadEvent} from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { Inventario } from '../entities/inventario.entity';
import { Sucursal } from 'src/sucursal/sucursal/entity/sucursal.entity';

@EventSubscriber()
export class ProductoSubscriber 
implements EntitySubscriberInterface<Producto>{

    listenTo(){
        return Producto
    }

    async afterInsert(event:LoadEvent<Producto>){
/* 
        await event.queryRunner.commitTransaction();
        await event.queryRunner.startTransaction();
        const sucRep = getRepository(Sucursal)
        const sucursal = await sucRep.find()


        for (let i = 0; i < sucursal.length; i++) {
            var suc:any = sucursal[i].id;
            event.manager 
            await getConnection()
            .createQueryBuilder()
            .insert().into(Inventario)
            .values([
                {producto:event.entity,sucursal:sucursal[i]}
            ]).execute()
        }
        return
 */    }
}
