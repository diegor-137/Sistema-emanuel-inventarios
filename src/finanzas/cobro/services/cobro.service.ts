import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VentaService } from 'src/ventas/venta/services/venta.service';
import { IsNull, Repository } from 'typeorm';
import { MovimientoCajaService } from '../../movimiento-caja/movimiento-caja.service';
import { CreateCobroDto } from '../dto/create-cobro.dto';
import { UpdateCobroDto } from '../dto/update-cobro.dto';
import { Cobro } from '../entities/cobro.entity';
import { User } from '../../../user/entities/user.entity';
import { Caja } from '../../caja/entities/caja.entity';
import { EgresosService } from '../../egresos/egresos.service';
import { Venta } from '../../../ventas/venta/entity/venta.entity';
import { CorteCaja } from '../../corte-caja/entities/corte-caja.entity';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { CuentaBancariaService } from '../../fondos/cuenta-bancaria/cuenta-bancaria.service';
import { CreateDetalleCuentaBancariaDto } from '../../fondos/cuenta-bancaria/dto/create-detalle-cuenta-bancaria.dto';
import { CuentaBancaria } from '../../fondos/cuenta-bancaria/entities/cuenta-bancaria';
import { CajaService } from 'src/finanzas/caja/caja.service';
import { AuthService } from 'src/auth/auth.service';

const start = new Date();
start.setHours(0, 0, 0, 0);
const end = new Date(start);
end.setDate(start.getDate() + 1);

@Injectable()
export class CobroService {

  constructor(
    @InjectRepository(Cobro)
    public readonly cobroRepository: Repository<Cobro>,
    @Inject(forwardRef(() => VentaService))
    private readonly ventasRepository: VentaService,
    private readonly movimientoCajaService: MovimientoCajaService,
    private readonly egresosService: EgresosService,
    private readonly CuentaBancariaService:CuentaBancariaService,
    @Inject(forwardRef(() => CajaService))
    private readonly cajaService:CajaService,
    private readonly authService:AuthService
  ) { }
  
  @Transactional()
  async create(createCobroDto: CreateCobroDto, user:User, cobroVenta:boolean){
    const decodedJwtAccessToken = await this.authService.decodeToken(createCobroDto.token);
    const caja = await this.cajaService.findOne(user.empleado.id)
    createCobroDto.empleado = decodedJwtAccessToken.empleado
    createCobroDto.caja = caja  
    if(cobroVenta){
      const venta = await this.ventasRepository.repository.findOne({where: {
        id:createCobroDto.venta.id
      }})
      venta.status = 'PAGADO'
      await this.ventasRepository.repository.save(venta);
      console.log('PAGADO DESDE CAJA');
    }
    console.log('PAGADO DESDE VENTAS'); 
    await createCobroDto.detalleCobro.reduce(async(b:any, a)=>{
      await b;
      if(a.tipoTransaccion.id !==1){
        a.descripcion = `Doc. no ${a.documento} cuenta No. ${a.cuentaBancaria.numero} ${a.cuentaBancaria.banco.nombre}`
        await this.createMovimientoBanco(a.documento, a.monto, Number(createCobroDto.venta.id), a.cuentaBancaria, user)
      }
    }, 0.00);
    const total = createCobroDto.detalleCobro.reduce((a:number, b)=>a+b.monto,0);
    await this.movimientoCajaService.create(total, `INGRESO VENTA NO.${createCobroDto.venta}`, 1, createCobroDto.caja, true)
    return await this.cobroRepository.save(createCobroDto);
  }

/* ####### TRASLADADO AL SERVICIO DE VENTAS ####### */   
  async updateVenta(id:number){
    const venta = await this.ventasRepository.repository.findOne(id)
    return await this.ventasRepository.repository.save(venta);
  }
/* ####### TRASLADADO AL SERVICIO DE VENTAS ####### */ 

  async findVentaNoCobro(user:User) {
    return await this.ventasRepository.repository.createQueryBuilder("venta")            
    .leftJoinAndSelect("venta.cliente", "cliente")
    .leftJoinAndSelect("venta.detalle", "detalle")
    .select(["venta.id as id", "cliente.nombre as cliente", "venta.created_At as fecha", "venta.status as status", "SUM(detalle.cantidad*detalle.precio_venta)as total"])   
    .andWhere("venta.sucursal.id = :id", {id: user.empleado.sucursal.id})
    .andWhere("venta.status = 'PENDIENTE'")
    .groupBy("venta.id,cliente.nombre,venta.created_At,venta.status")
    .orderBy("venta.id", "ASC")
    .getRawMany()    
  }
 
  /* TODO: HAY QUE ADAPTARLO A LA HORA DE ELIMINAR UNA VENTA */
  @Transactional()
  async remove(id: number,  user:User, caja:Caja) {
    const cobro = await this.cobroRepository.findOne(id, { relations: ['detalleCobro', 'venta']})            
    const venta = await this.ventasRepository.repository.findOne(cobro.venta.id, {relations: ['cobro']});
    if(venta.cobro.length >1)throw new BadRequestException('Para anular el cobro debe anular la venta!');
    cobro.deletedAt = new Date();
    cobro.deleteResponsible = user.empleado;
    venta.status = 'PENDIENTE'
    const monto = cobro.detalleCobro.reduce((sum, a)=> sum +  Number(a.monto), 0.00);    
    await this.ventasRepository.repository.save(venta);  
    await this.movimientoCajaService.create(monto, `EGRESO ANULACION COBRO NO.${cobro.id}, VENTA NO. ${venta.id}`, 2, caja, false)
    return await this.cobroRepository.save(cobro);
  }

  @Transactional()
  async delete(id: number,  user:User, caja:Caja){
    const venta = await this.ventasRepository.repository.createQueryBuilder('venta')
                .innerJoinAndSelect('venta.cobro', 'cobro')
                .andWhere("venta.id = :id", {id})
                .having("cobro.deletedAt IS NULL")
                .groupBy("venta.id, cobro.id")
                .getOne()
    const cobroVenta = venta.cobro.reduce(value=>value);
    if(!venta)throw new BadRequestException('La venta no existe');
    const cobro = await this.cobroRepository.findOne(cobroVenta.id, {relations: ['corteCaja', 'detalleCobro']})
    if(!cobro || cobro.deletedAt != null )throw new BadRequestException('El cobro no existe o ya ha sido eliminado');
    cobro.deletedAt = new Date();
    cobro.deleteResponsible = user.empleado;
    const monto = cobro.detalleCobro.reduce((sum, a)=> sum +  Number(a.monto), 0.00)
    await this.cobroRepository.save(cobro);
    if(cobro.corteCaja) await this.egresosService.create({caja, descripcion: `Egreso por anulacion de cobro No. ${cobro.id}, venta No. ${venta.id} de corte ${cobro.corteCaja.id}`, monto});
    await this.movimientoCajaService.create(monto, `EGRESO ANULACION DE VENTA NO. ${venta.id} CON COBRO NO.${cobro.id}`, 2, caja, false)  
    return cobro;
  }

  /* ################### BANCO ##################### */

  @Transactional({propagation: Propagation.MANDATORY})
  async createMovimientoBanco(doc:string, monto:number, venta:number, cuenta:CuentaBancaria, user:User){
    const detalle:CreateDetalleCuentaBancariaDto={
      documento: doc,
      descripcion: `INGRESO POR VENTA NO. ${venta}`,
      monto,
      type: true,
    }
  return await this.CuentaBancariaService.transaccion(detalle, user, cuenta.id)
  }

 /* ################## FUNCION USADO FUERA DE SU MODULO ################## */
 
 async cobros(corte:CorteCaja){
  const cobros = await this.cobroRepository.find({
    relations: ["corteCaja"], 
    where: { caja: {id: corte.caja.id}, corteCaja: {id: IsNull()}, deletedAt: IsNull()}
  });
  if(cobros) {
    cobros.map(cobro=> cobro.corteCaja = corte)
    await this.cobroRepository.save(cobros);
  };
}

}