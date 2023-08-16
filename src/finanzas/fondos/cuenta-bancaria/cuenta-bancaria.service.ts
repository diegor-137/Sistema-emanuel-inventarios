import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VentaService } from 'src/ventas/venta/services/venta.service';
import { IsNull, Repository } from 'typeorm';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { CuentaBancaria } from './entities/cuenta-bancaria';
import { CreateCuentaBancariaDto } from './dto/create-cuenta-bancaria.dto';
import { User } from 'src/user/entities/user.entity';

const start = new Date();
start.setHours(0, 0, 0, 0);
const end = new Date(start);
end.setDate(start.getDate() + 1);

@Injectable()
export class CuentaBancariaService {

  constructor(
    @InjectRepository(CuentaBancaria)
    public readonly cuentaBancariaRepository: Repository<CuentaBancaria>,
  ) { }
  
  @Transactional()
  async create(createCuentaBancariaDto:CreateCuentaBancariaDto, user:User){
    const cuentaBancaria = this.cuentaBancariaRepository.create(createCuentaBancariaDto);
    return this.cuentaBancariaRepository.save(cuentaBancaria)
  }
}