import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import { Departamento } from "../entity/departamento.entity";

@EventSubscriber()
export class DepartamentoSubscriber
implements EntitySubscriberInterface<Departamento>{
    listenTo(){
        return Departamento
    }

    async afterInsert(event: InsertEvent<Departamento>){
        console.log("Creado:",event.entity)        
    }
}