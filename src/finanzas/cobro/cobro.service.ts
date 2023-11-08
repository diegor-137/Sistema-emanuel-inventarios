import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VentaService } from 'src/ventas/venta/services/venta.service';
import { IsNull, Repository } from 'typeorm';
import { MovimientoCajaService } from '../movimiento-caja/movimiento-caja.service';
import { CreateCobroDto } from './dto/create-cobro.dto';
import { UpdateCobroDto } from './dto/update-cobro.dto';
import { Cobro } from './entities/cobro.entity';
import { User } from '../../user/entities/user.entity';
import { Caja } from '../caja/entities/caja.entity';
import { EgresosService } from '../egresos/egresos.service';
import { Venta } from '../../ventas/venta/entity/venta.entity';
import { CorteCaja } from '../corte-caja/entities/corte-caja.entity';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { CuentaBancariaService } from '../fondos/cuenta-bancaria/cuenta-bancaria.service';
import { CreateDetalleCuentaBancariaDto } from '../fondos/cuenta-bancaria/dto/create-detalle-cuenta-bancaria.dto';
import { CuentaBancaria } from '../fondos/cuenta-bancaria/entities/cuenta-bancaria';

const start = new Date();
start.setHours(0, 0, 0, 0);
const end = new Date(start);
end.setDate(start.getDate() + 1);

@Injectable()
export class CobroService {

  constructor(
    @InjectRepository(Cobro)
    public readonly cobroRepository: Repository<Cobro>,
    private readonly ventasRepository: VentaService,
    private readonly movimientoCajaService: MovimientoCajaService,
    private readonly egresosService: EgresosService,
    private readonly CuentaBancariaService:CuentaBancariaService
  ) { }
  
  @Transactional()
  async create(createCobroDto: CreateCobroDto, user:User){
    const venta = await this.ventasRepository.repository.findOne(createCobroDto.venta)
    venta.status = 'PAGADO'
    await this.ventasRepository.repository.save(venta);
    await createCobroDto.detalleCobro.reduce(async(b:any, a)=>{
      await b;
      if(a.tipoTransaccion.id !==1){
        a.descripcion = `Doc. no ${a.documento} cuenta No. ${a.cuentaBancaria.numero} ${a.cuentaBancaria.banco.nombre}`
        await this.createMovimientoBanco(a.documento, a.monto, Number(createCobroDto.venta), a.cuentaBancaria, user)
      }
    }, 0.00);
    const total = createCobroDto.detalleCobro.reduce((a:number, b)=>a+b.monto,0);
    await this.movimientoCajaService.create(total, `INGRESO VENTA NO.${createCobroDto.venta}`, 1, createCobroDto.caja, true)
    return await this.cobroRepository.save(createCobroDto);
  }

  async updateVenta(id:number, status:string){
    const venta = await this.ventasRepository.repository.findOne(id)
    venta.status = status
    return await this.ventasRepository.repository.save(venta);
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

  async findVentaToday(user:User) {
    return await this.ventasRepository.repository.createQueryBuilder("venta")            
    .leftJoinAndSelect("venta.cliente", "cliente")
    .leftJoinAndSelect("venta.detalle", "detalle")
    .select(["venta.id as id", "cliente.nombre as cliente", "venta.created_At as fecha", "venta.status as status", "SUM(detalle.cantidad*detalle.precio_venta)as total"])
/*     .andWhere("venta.created_At >= :start", {start})    
    .andWhere("venta.created_At < :end", {end}) */    
    .andWhere("venta.sucursal.id = :id", {id: user.empleado.sucursal.id})
    .andWhere("venta.status = 'PENDIENTE'")
    .groupBy("venta.id,cliente.nombre,venta.created_At,venta.status")
    .orderBy("venta.id", "ASC")
    .getRawMany()    
  }

  async findAllCobros(id:number){
        const st = new Date(start)
        const en = new Date(end)
        en.setDate(en.getDate() + 1);
        return await this.cobroRepository.createQueryBuilder("cobro")            
                .leftJoinAndSelect("cobro.venta", "venta")
                .leftJoinAndSelect("venta.cliente", "cliente")
                .leftJoinAndSelect("cobro.detalleCobro", "detalleCobro")
                .select(["cobro.id as id", "cobro.fecha as fecha", "venta.id as venta", "cliente.nombre as cliente", "SUM(detalleCobro.monto)as total"])
                .where("cobro.caja.id = :id", {id})
                /* .andWhere("cobro.fecha >= :st", {st})
                .andWhere("cobro.fecha < :en", {en}) */
                .andWhere("cobro.deletedAt IS NULL")
                .andWhere("cobro.corteCaja.id IS NULL")
                .orderBy("cobro.fecha", "ASC")
                .groupBy("cobro.id, venta.id, cliente.nombre")
                .getRawMany() 
  }

  async findAll(start: Date, end:Date, id:number) {
    const st = new Date(start)
    const en = new Date(end)
    en.setDate(en.getDate() + 1);
    return await this.cobroRepository.createQueryBuilder("cobro")            
            .leftJoinAndSelect("cobro.empleado", "empleado")
            .leftJoinAndSelect("cobro.venta", "venta")
            .leftJoinAndSelect("venta.cliente", "cliente")
            .leftJoinAndSelect("cobro.detalleCobro", "detalleCobro")
            .select(["cobro.id as id", "cobro.fecha as fecha", "empleado.nombre as nombre", "empleado.apellido as apellido", "venta.id as venta", "cliente.nombre as cliente", "SUM(detalleCobro.monto)as total"])
            .where("cobro.caja.id = :id", {id})
            .andWhere("cobro.fecha >= :st", {st})
            .andWhere("cobro.fecha < :en", {en})
            .andWhere("cobro.deletedAt IS NULL")
            .orderBy("cobro.fecha", "ASC")
            .groupBy("cobro.id, empleado.id, venta.id, cliente.nombre")
            .getRawMany();      
  }

  async findAllDeleted(start: Date, end:Date, id:number) {
    const st = new Date(start)
    const en = new Date(end)
    en.setDate(en.getDate() + 1);
    return await this.cobroRepository.createQueryBuilder("cobro")            
            .leftJoinAndSelect("cobro.empleado", "empleado")
            .leftJoinAndSelect("cobro.venta", "venta")
            .leftJoinAndSelect("venta.cliente", "cliente")
            .leftJoinAndSelect("cobro.detalleCobro", "detalleCobro")
            .leftJoinAndSelect("cobro.deleteResponsible", "deleteResponsible")
            .select(["cobro.id as id", "cobro.fecha as fecha", "empleado.nombre as nombre", "empleado.apellido as apellido", "venta.id as venta", "cliente.nombre as cliente", "SUM(detalleCobro.monto)as total", "cobro.deletedAt as deletedAt",
              "deleteResponsible.nombre as nombreresp", "deleteResponsible.apellido as apellidoresp",  
            ])
            .where("cobro.caja.id = :id", {id})
            .andWhere("cobro.fecha >= :st", {st})
            .andWhere("cobro.fecha < :en", {en})
            .andWhere("cobro.deletedAt IS NOT NULL")
            .orderBy("cobro.fecha", "ASC")
            .groupBy("cobro.id, empleado.id, venta.id, cliente.nombre, deleteResponsible.id")
            .getRawMany();      
  }
  
  async findOne(id: number) {
    return await this.cobroRepository.findOne(id, {relations: ["detalleCobro", "detalleCobro.tipoTransaccion"]});   
  }

  async findCobro(id: number) {
    return await this.cobroRepository.createQueryBuilder("cobro")
            .leftJoinAndSelect("cobro.empleado", "empleado")      
            .leftJoinAndSelect("cobro.venta", "venta")      
            .leftJoinAndSelect("venta.cliente", "cliente")      
            .leftJoinAndSelect("cobro.caja", "caja")      
            .leftJoinAndSelect("caja.empleado", "empleadCaja")      
            .leftJoinAndSelect("cobro.detalleCobro", "detalleCobro")      
            .leftJoinAndSelect("detalleCobro.tipoTransaccion", "tipoTransaccion")
            .select(["cobro.id", "cobro.fecha", "empleado.nombre", "empleado.apellido", "venta.id", "venta.createdAt", "cliente.id", "cliente.nombre", "cliente.direccion", 
            "caja.id", "caja.nombre", "empleadCaja.nombre", "empleadCaja.apellido", "detalleCobro", "tipoTransaccion"])
            .where("cobro.id = :id", {id})
            .getOne()      
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

  /* FUNCIONES USADAS FUERA DE SU MODULO*/

  async totalCobro(id:number){
    return await this.cobroRepository.createQueryBuilder("cobro")                                
    .innerJoinAndSelect("cobro.detalleCobro", "detalle")
    .leftJoinAndSelect("cobro.caja", "caja")
    .leftJoinAndSelect("cobro.corteCaja", "corte")
    .select('SUM(detalle.monto)', 'cobro')
    .where('caja.id = :id', {id})
    .andWhere('corte.id IS NULL')
    .andWhere('cobro.deletedAt IS NULL')
    .getRawOne() 
  }

/*   async ventasCobrosCorte(idCaja:number, idCorte:number){
    return await this.cobroRepository.createQueryBuilder("cobro")                                
    .innerJoinAndSelect("cobro.detalleCobro", "detalle")
    .innerJoinAndSelect("cobro.venta", "venta")
    .innerJoinAndSelect("venta.cliente", "cliente")
    .select(['cobro.id', 'cobro.fecha', 'cobro.deletedAt','detalle.monto', 'venta.id', 'cliente.nombre'])
    .where('cobro.corteCaja.id = :idCaja', {idCaja})
    .andWhere('cobro.caja.id = :idCorte', {idCorte})
    .getMany() 
  } */

  
    async ventasCobrosCorte(idCaja:number, idCorte:number){
    return await this.cobroRepository.createQueryBuilder("cobro")                                
    .innerJoinAndSelect("cobro.detalleCobro", "detalle")
    .innerJoinAndSelect("cobro.venta", "venta")
    .innerJoinAndSelect("venta.cliente", "cliente")
    .select(['cobro.id AS id', 'cobro.fecha AS fecha', 'cobro.deletedAt AS deletedAt','SUM(detalle.monto) AS monto', 'venta.id', 'cliente.nombre AS cliente'])
    .where('cobro.corteCaja.id = :idCaja', {idCaja})
    .andWhere('cobro.caja.id = :idCorte', {idCorte})
    .groupBy('cobro.id, venta.id, cliente.id')
    .getRawMany() 
  }
 

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

  /* CONSULTA PARA MANDAR A LLAMAR TODOS LOS COBROS EN EL BANCO */

  async totalCobroEfectivo(id:number){
    return await this.cobroRepository.createQueryBuilder("cobro")                                
    .innerJoinAndSelect("cobro.detalleCobro", "detalle", 
     "detalle.tipoTransaccion.id = 1" 
    )
    .leftJoinAndSelect("cobro.caja", "caja")
    .leftJoinAndSelect("cobro.corteCaja", "corte")
    .select('SUM(detalle.monto)', 'cobroEfectivo')
    .where('caja.id = :id', {id})
    .andWhere('corte.id IS NULL')
    .andWhere('cobro.deletedAt IS NULL')
    .getRawOne() 
  }

  async totalCobroBanco(id:number){
    return await this.cobroRepository.createQueryBuilder("cobro")                                
    .innerJoinAndSelect("cobro.detalleCobro", "detalle", 
     "detalle.tipoTransaccion.id != 1" 
    )
    .leftJoinAndSelect("cobro.caja", "caja")
    .leftJoinAndSelect("cobro.corteCaja", "corte")
    .select('SUM(detalle.monto)', 'cobroBanco')
    .where('caja.id = :id', {id})
    .andWhere('corte.id IS NULL')
    .andWhere('cobro.deletedAt IS NULL')
    .getRawOne() 
  }

}