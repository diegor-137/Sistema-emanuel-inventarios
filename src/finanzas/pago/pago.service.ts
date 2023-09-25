import { Injectable } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pago } from './entities/pago.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { CreateDetalleEfectivoDto } from '../fondos/efectivo/dto/create-detalle-efectivo.dto';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { CreateDetalleCuentaBancariaDto } from '../fondos/cuenta-bancaria/dto/create-detalle-cuenta-bancaria.dto';
import { CuentaBancaria } from '../fondos/cuenta-bancaria/entities/cuenta-bancaria';
import { CuentaBancariaService } from '../fondos/cuenta-bancaria/cuenta-bancaria.service';
import { EfectivoService } from '../fondos/efectivo/efectivo.service';
import { Compra } from 'src/compras/compra/entity/compra.entity';

@Injectable()
export class PagoService {

  constructor(
    @InjectRepository(Pago)
    public readonly pagoRepository: Repository<Pago>,
    private readonly CuentaBancariaService:CuentaBancariaService,
    private readonly efectivoService:EfectivoService
  ) { }

  @Transactional()
  async create(createPagoDto: CreatePagoDto, user:User) {
      await createPagoDto.detallePago.reduce(async(b:any, a)=>{
        await b;
        if(a.tipoTransaccion.id == 1){
          await this.createMovimientoEfectivo('', a.monto, createPagoDto.compra, user, createPagoDto.efectivo);         
        }else{
        a.descripcion = `Doc. no ${a.documento} cuenta No. ${a.cuentaBancaria.numero} ${a.cuentaBancaria.banco.nombre}`
          await this.createMovimientoBanco(a.documento, a.monto, createPagoDto.compra, a.cuentaBancaria, user)
        }
      }, 0.00);
      return await this.pagoRepository.save(createPagoDto);
  }

  @Transactional({propagation: Propagation.MANDATORY})
  async createMovimientoBanco(doc:string, monto:number, compra:Compra, cuenta:CuentaBancaria, user:User){
    const detalle:CreateDetalleCuentaBancariaDto={
      documento: doc,
      descripcion: `EGRESO POR COMPRA NO. ${compra.documento}`,
      monto,
      type: false,
    }
  return await this.CuentaBancariaService.transaccion(detalle, user, cuenta.id)
  }

  @Transactional({propagation: Propagation.MANDATORY})
  async createMovimientoEfectivo(doc:string, cantidad:number, compra:Compra, user:User, id:number){
    const detalle:CreateDetalleEfectivoDto={
      documento: doc,
      descripcion: `EGRESO POR COMPRA NO. ${compra.documento}`,
      monto: cantidad,
      type: false
    }
  return await this.efectivoService.transaccion(detalle, user, id)
  }

}
