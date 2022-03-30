import { Injectable } from "@nestjs/common";
import { DataService } from '../../common/service/common.service';
import { Precio } from "./entities/precio.entity";
import { CreateCompraDto } from '../../compras/compra/dto/create-compra.dto';

@Injectable()
export class PrecioService extends DataService(Precio){

    async Costo(dto:CreateCompraDto){
        for (let i = 0; i < dto.detalle.length; i++) {  
            const productos = dto.detalle[i]          
            const precio = await this.repository.find({
                where:{
                    producto:productos.producto
                },
                relations:["tipoPrecio"]
            })
            console.log(precio);

        }
    }

}