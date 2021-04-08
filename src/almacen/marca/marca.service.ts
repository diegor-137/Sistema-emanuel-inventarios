import { Injectable } from '@nestjs/common';
import { MarcaDto } from './dto/marca.dto';
import { DataService } from '../../common/service/common.service';
import { Marca } from './entities/marca.entity';

@Injectable()
export class MarcaService extends DataService(Marca) {

  async create(marca: MarcaDto) {
        return this.repository.save(marca);
  }

  async update(id: number, marca: MarcaDto) {
        const marc = await this.repository.findOne(id);
        const editMarc = Object.assign(marc, marca);
        return await this.repository.save(editMarc);
  }

}
