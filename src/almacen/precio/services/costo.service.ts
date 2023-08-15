import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { CreateCostoDto } from '../dto/create-costo.dto';
import { Costo } from '../entities/costo.entity';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { Producto } from 'src/almacen/producto/entities/producto.entity';
import { Region } from 'src/sucursales/region/entity/region.entity';

@Injectable()
export class CostoService {
    
        constructor(
        @InjectRepository(Costo)
        public readonly repository:Repository<Costo>
        ){}

        async createOne(dto: CreateCostoDto) {
            const data = this.repository.create(dto);
            return await this.repository.save(data);
        }
          
        @Transactional({propagation:Propagation.MANDATORY})
        async afterCreateNewProd(dto:Producto){
          const regionRep = getRepository(Region)
          const region = await regionRep.find()

          for (let i = 0; i < region.length; i++) {
            let esultado = await this.repository
            .createQueryBuilder()
            .insert()
            .values([
              {producto:dto,region:region[i]}
            ]).execute()
            console.log(esultado)
          }
          //
          return
        }

        @Transactional({propagation:Propagation.MANDATORY}) 
        async createNewCosto(producto:any,region:any){
          const creado = await this.repository.createQueryBuilder()
          .insert()
          .values([
            {producto, region}
          ]).execute()
          console.log('creacion:',creado)
          return
        }
}
