import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePrecioDto } from '../dto/create-precio.dto';
import { Precio } from '../entities/precio.entity';

@Injectable()
export class PrecioService {
        
    constructor(
        @InjectRepository(Precio)
        public readonly repository:Repository<Precio>
    ){}

    async findAll(){
        return await this.repository.find({
            where:[{
                estado:true
            }],
            relations:["producto","tipoPrecio","region"]
        })
    }

    async CreateOne(dto:CreatePrecioDto){
        const precio = this.repository.create(dto)
        return await this.repository.save(precio)
    }
/***


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
 */
}
