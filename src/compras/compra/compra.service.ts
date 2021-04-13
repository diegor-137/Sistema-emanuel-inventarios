import { Injectable } from '@nestjs/common';
import { CreateCompraDto } from './dto/create-compra.dto';
import { DataService } from '../../common/service/common.service';
import { Compra } from './entity/compra.entity';

@Injectable()
export class CompraService extends DataService(Compra) {

    async createOne(dto:CreateCompraDto){
        const compra = this.repository.create(dto)
        return await this.repository.save(compra)
    }
}
