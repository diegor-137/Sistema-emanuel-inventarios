import { Injectable } from '@nestjs/common';
import { DataService } from 'src/common/service/common.service';
import { Categoria } from './entity/categoria.entity';
import { CategoriaDto } from './dtos/categoria.dto';

@Injectable()
export class CategoriaService extends DataService(Categoria) {

    async save(categoria : CategoriaDto){
        return this.repository.save(categoria);
    }

    async editOne(id:number ,categoria : CategoriaDto){
        const cat = await this.repository.findOne(id);
        const editCat = Object.assign(cat, categoria);
        return await this.repository.save(editCat);
    }
}
