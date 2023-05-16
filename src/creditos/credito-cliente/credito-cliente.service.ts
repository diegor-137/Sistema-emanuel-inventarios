import { Injectable, NotFoundException, UnauthorizedException, Inject, forwardRef} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from 'src/recursos-humanos/empleado/entity/empleado.entity';
import { Sucursal } from 'src/sucursal/sucursal/entity/sucursal.entity';
import { Cliente } from 'src/ventas/cliente/entity/cliente.entity';
import { Venta } from 'src/ventas/venta/entity/venta.entity';
import { Repository } from 'typeorm';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { CuentasPorCobrarService } from '../cuentas-por-cobrar/cuentas-por-cobrar.service';
import { CreateCreditoClienteDto } from './dto/create-credito-cliente.dto';
import { UpdateCreditoDto } from './dto/update-credito-cliente.dto';
import { CreditoCliente } from './entities/credito-cliente.entity';


@Injectable()
export class CreditoClienteService {

  constructor(
    @InjectRepository(CreditoCliente)
    public readonly creditoRepository:Repository<CreditoCliente>,
    @Inject(forwardRef(() => CuentasPorCobrarService))
    public readonly cuentasPorCobrarService:CuentasPorCobrarService
  ){}

  async create(createCreditoDto: CreateCreditoClienteDto) {
    const credito = this.creditoRepository.create(createCreditoDto);
    return this.creditoRepository.save(credito);
  }

  @Transactional({propagation: Propagation.MANDATORY})
  async findOneAndAllowCredit(venta:Venta, empleado:Empleado){
    const credit = await this.creditoRepository.findOne({where: {cliente: venta.cliente.id, sucursal: empleado.sucursal}});
    if(!credit) throw new NotFoundException('El cliente no tiene creditos autorizados');
    const totalVent = venta.detalle.reduce((sum, a)=> sum +  Number(a.cantidad * a.precio_venta), 0.00);
    const {totalCuenta, totalVentaCredito} = await this.cuentasPorCobrarService.totalCuentasPorCobrarCliente(venta.cliente.id);
    console.log('Credito Limite',Number(credit.limite));
    console.log('Total venta',totalVent);
    console.log('Total Credito',Number(totalVentaCredito));
    console.log('Abono Credito',Number(totalCuenta));
    let creditoTenido = Number(totalVentaCredito) - Number(totalCuenta);
    let disponible = credit.limite - creditoTenido;
    console.log('Disponible', disponible);    
    if(totalVent > disponible) throw new UnauthorizedException(`El cliente ${venta.cliente.nombre} solo tiene Q. ${disponible} disponibles para creditos`)     
  }

  /* FUNCIONES USADAS FUERA DE SU MODULO*/
  async findOne(cliente:Cliente, sucursal:Sucursal){
    return await this.creditoRepository.findOne({
      where :{
        cliente, sucursal
      }
    })
  }

}
