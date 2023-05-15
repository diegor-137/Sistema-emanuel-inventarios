import { Injectable, NotFoundException, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Compra } from 'src/compras/compra/entity/compra.entity';
import { Empleado } from 'src/recursos-humanos/empleado/entity/empleado.entity';
import { Repository } from 'typeorm';
import { Transactional, Propagation } from 'typeorm-transactional-cls-hooked';
import { CuentaPorPagarService } from '../cuentas-por-pagar/cuenta-por-pagar.service';
import { CreateCreditoProveedorDto } from './dto/create-credito-proveedor.dto';
import { UpdateCreditoProveedorDto } from './dto/update-credito-proveedor.dto';
import { CreditoProveedor } from './entities/credito-proveedor.entity';
import { Proveedor } from '../../compras/proveedor/entity/proveedor.entity';
import { Sucursal } from 'src/sucursal/entity/sucursal.entity';

@Injectable()
export class CreditoProveedorService {
  constructor(
    @InjectRepository(CreditoProveedor)
    private readonly creditoRepository:Repository<CreditoProveedor>,
    @Inject(forwardRef(() => CuentaPorPagarService))
    private readonly cuentasPorPagarService:CuentaPorPagarService,

  ){}

  async create(createCreditoDto: CreateCreditoProveedorDto) {
    const credito = this.creditoRepository.create(createCreditoDto);
    return this.creditoRepository.save(credito);
  }

  @Transactional({propagation: Propagation.MANDATORY})
  async findOneAndAllowCredit(compra:Compra, empleado:Empleado){
    const credit = await this.creditoRepository.findOne({where: {proveedor: compra.proveedor.id, sucursal: empleado.sucursal}});
    if(!credit) throw new NotFoundException('El proveedor no tiene creditos autorizados');
    const totalVent = compra.detalle.reduce((sum, a)=> sum +  Number(a.cantidad * a.precio), 0.00);
    const {totalCuenta, totalCompraCredito} = await this.cuentasPorPagarService.totalCuentasPorPagarProveedor(compra.proveedor.id);
    console.log('Credito Limite',Number(credit.limite));
    console.log('Total venta',totalVent);
    console.log('Total Credito',Number(totalCompraCredito));
    console.log('Abono Credito',Number(totalCuenta));
    let creditoTenido = Number(totalCompraCredito) - Number(totalCuenta);
    let disponible = credit.limite - creditoTenido;
    console.log('Disponible', disponible);    
    if(totalVent > disponible) throw new UnauthorizedException(`El proveedor ${compra.proveedor.nombre} solo tiene Q. ${disponible} disponibles para creditos`)        
  }

  /* FUNCIONES USADAS FUERA DE SU MODULO*/
  async findOne(proveedor:Proveedor, sucursal:Sucursal){
    return await this.creditoRepository.findOne({
      where :{
        proveedor, sucursal
      }
    })
  }

}
