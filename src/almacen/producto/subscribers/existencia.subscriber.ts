import { EntitySubscriberInterface, EventSubscriber, InsertEvent, Repository, getRepository, getCustomRepository, getConnection, Connection } from 'typeorm';
import { Producto } from '../entities/producto.entity';
import { Inventario } from '../entities/inventario.entity';
import { Sucursal } from 'src/sucursal/entity/sucursal.entity';

@EventSubscriber()
export class ProductoSubscriber 
implements EntitySubscriberInterface<Producto>{

    listenTo(){
        return Producto
    }

    async afterInsert(event:InsertEvent<Producto>){

     /*   const sucRep = getRepository(Sucursal)
        const sucursal = await sucRep.find()

        var product = event.entity.id;
        for (let i = 0; i < sucursal.length; i++) {
            var suc:any = sucursal[i].id;
            
            //console.log(suc, product);
           await getConnection().createQueryBuilder()
            .insert().into(Inventario)
            .values([
                {producto:event.entity,sucursal:sucursal[i]}
            ]).execute()

        }*/
 
    }
}
