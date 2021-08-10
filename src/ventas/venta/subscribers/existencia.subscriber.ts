import { EntitySubscriberInterface, EventSubscriber, InsertEvent, Repository } from 'typeorm';
import { Venta } from '../entity/venta.entity';

@EventSubscriber()
export class existenciaSubscriber implements EntitySubscriberInterface<Venta>{

    listenTo(){
        return Venta
    }

    async afterInsert(event:InsertEvent<Venta>){
        const ventaRep: Repository<Venta> = event.connection.manager.getRepository<Venta>('venta')
        //const Rep2:
    }
}
