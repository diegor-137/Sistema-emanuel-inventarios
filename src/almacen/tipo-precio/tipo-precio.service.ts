import { Injectable } from '@nestjs/common';
import { DataService } from '../../common/service/common.service';
import { TipoPrecio } from './entities/tipo-precio.entity';
import { TipoPrecioDto } from './dto/tipo-precio.dto';

@Injectable()
export class TipoPrecioService extends DataService(TipoPrecio) {


    async create(tipo: TipoPrecioDto) {
        return await this.repository.save(tipo);
  }

  async update(id: number, tipo: TipoPrecioDto) {
        const type = await this.repository.findOne(id);
        const editTipo = Object.assign(type, tipo);
        return await this.repository.save(editTipo);
  }

}
