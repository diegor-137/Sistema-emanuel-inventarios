import { Injectable } from "@nestjs/common";
import { DataService } from '../../../common/service/common.service';
import { Precio } from "../entities/precio.entity";
import { CreateCompraDto } from '../../../compras/compra/dto/create-compra.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class PrecioService{

    constructor(
        @InjectRepository(Precio)
        public readonly repository:Repository<Precio>
    ){}

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