import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VentaService } from 'src/ventas/venta/venta.service';
import { Repository } from 'typeorm';
import { MovimientoCajaService } from '../movimiento-caja/movimiento-caja.service';
import { CreateCobroDto } from './dto/create-cobro.dto';
import { UpdateCobroDto } from './dto/update-cobro.dto';
import { Cobro } from './entities/cobro.entity';
import { User } from '../../user/entities/user.entity';
import { Caja } from '../caja/entities/caja.entity';
import { EgresosService } from '../egresos/egresos.service';
import { Venta } from '../../ventas/venta/entity/venta.entity';

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
  ) { }

  async create(createCobroDto: CreateCobroDto){
    const result = await this.cobroRepository.save(createCobroDto);
    const venta = await this.ventasRepository.repository.findOne(createCobroDto.venta)
    venta.status = 'PAGADO'
    await this.ventasRepository.repository.save(venta);
    const monto = result.detalleCobro.map(t=> t.cantidad).reduce((acc, value) => acc + value, 0);
    await this.movimientoCajaService.create(monto, `INGRESO COBRO NO.${result.id}`, 1, createCobroDto.caja, true)
    return result
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
            .select(["cobro.id as id", "cobro.fecha as fecha", "empleado.nombre as nombre", "empleado.apellido as apellido", "venta.id as venta", "cliente.nombre as cliente", "SUM(detalleCobro.cantidad)as total"])
            .where("cobro.caja.id = :id", {id})
            .andWhere("cobro.fecha >= :st", {st})
            .andWhere("cobro.fecha < :en", {en})
            .orderBy("cobro.fecha", "ASC")
            .groupBy("cobro.id, empleado.id, venta.id, cliente.nombre")
            .getRawMany()      
    ;
  }

  async findVentaToday(user:User) {
    return await this.ventasRepository.repository.createQueryBuilder("venta")            
    .leftJoinAndSelect("venta.cliente", "cliente")
    .leftJoinAndSelect("venta.detalle", "detalle")
    .select(["venta.id as id", "cliente.nombre as cliente", "venta.created_At as fecha", "venta.status as status", "SUM(detalle.cantidad*detalle.precio_venta)as total"])
    /* .andWhere("venta.created_At >= :start", {start})    
    .andWhere("venta.created_At < :end", {end}) */    
    .andWhere("venta.sucursal.id = :id", {id: user.empleado.sucursal.id})
    .andWhere("venta.status = 'PENDIENTE'")
    .groupBy("venta.id,cliente.nombre,venta.created_At,venta.status")
    .getRawMany()    
  }

  async findAllCobros(id:number){
      /* return await this.ventasRepository.repository.createQueryBuilder("venta") 
        .leftJoinAndSelect("venta.cliente","cliente")
        .leftJoinAndSelect("venta.detalle","detalle")
        .innerJoinAndSelect("venta.cobro","cobro")
        .select(["venta.id as id", "cliente.nombre as cliente","venta.created_At as fecha", "venta.status as status", 
        "SUM(detalle.cantidad*detalle.precio_venta)as total", "cobro.id as idCobro"])
        .andWhere("venta.created_At >= :start", {start})    
        .andWhere("venta.created_At < :end", {end}) 
        .groupBy("venta.id,cliente.nombre,venta.created_At,venta.status,cobro.id")
        .getRawMany() */
        const st = new Date(start)
        const en = new Date(end)
        en.setDate(en.getDate() + 1);
        return await this.cobroRepository.createQueryBuilder("cobro")            
                .leftJoinAndSelect("cobro.venta", "venta")
                .leftJoinAndSelect("venta.cliente", "cliente")
                .leftJoinAndSelect("cobro.detalleCobro", "detalleCobro")
                .select(["cobro.id as id", "cobro.fecha as fecha", "venta.id as venta", "cliente.nombre as cliente", "SUM(detalleCobro.cantidad)as total"])
                .where("cobro.caja.id = :id", {id})
                .andWhere("cobro.fecha >= :st", {st})
                .andWhere("cobro.fecha < :en", {en})
                .andWhere("cobro.deletedAt IS NULL")
                .andWhere("cobro.corteCaja.id IS NULL")
                .orderBy("cobro.fecha", "ASC")
                .groupBy("cobro.id, venta.id, cliente.nombre")
                .getRawMany() 
  }

  
  async findOne(id: number) {
    return await this.cobroRepository.findOne(id, {relations: ["detalleCobro", "detalleCobro.tipoCobro"]});   
  }

  async findCobro(id: number) {
    //return await this.cobroRepository.findOne(id, {relations: ["empleado", "venta", "caja","detalleCobro", "detalleCobro.tipoCobro"]});
    return await this.cobroRepository.createQueryBuilder("cobro")
            .leftJoinAndSelect("cobro.empleado", "empleado")      
            .leftJoinAndSelect("cobro.venta", "venta")      
            .leftJoinAndSelect("venta.cliente", "cliente")      
            .leftJoinAndSelect("cobro.caja", "caja")      
            .leftJoinAndSelect("caja.empleado", "empleadCaja")      
            .leftJoinAndSelect("cobro.detalleCobro", "detalleCobro")      
            .leftJoinAndSelect("detalleCobro.tipoCobro", "tipoCobro")
            .select(["cobro.id", "cobro.fecha", "empleado.nombre", "empleado.apellido", "venta.id", "venta.createdAt", "cliente.id", "cliente.nombre", "cliente.direccion", 
            "caja.id", "caja.lugar", "empleadCaja.nombre", "empleadCaja.apellido", "detalleCobro", "tipoCobro"])
            .where("cobro.id = :id", {id})
            .getOne()      
  }
  
  async remove(id: number,  user:User, caja:Caja) {
    const cobro = await this.cobroRepository.findOne(id, { relations: ['detalleCobro', 'venta']})            
    const venta = await this.ventasRepository.repository.findOne(cobro.venta.id, {relations: ['cobro']});
    if(venta.cobro.length >1)throw new BadRequestException('Para anular el cobro debe anular la venta!');
    cobro.deletedAt = new Date();
    cobro.deleteResponsible = user.empleado;
    venta.status = 'PENDIENTE'
    const monto = cobro.detalleCobro.reduce((sum, a)=> sum +  Number(a.cantidad), 0.00);    
    await this.ventasRepository.repository.save(venta);  
    await this.movimientoCajaService.create(monto, `EGRESO ANULACION COBRO NO.${cobro.id}, VENTA NO. ${venta.id}`, 2, caja, false)
    return await this.cobroRepository.save(cobro);
  }

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
    const monto = cobro.detalleCobro.reduce((sum, a)=> sum +  Number(a.cantidad), 0.00)
    await this.cobroRepository.save(cobro);
    if(cobro.corteCaja) await this.egresosService.create({caja, descripcion: `Egreso por anulacion de cobro No. ${cobro.id}, venta No. ${venta.id} de corte ${cobro.corteCaja.id}`, monto});
    await this.movimientoCajaService.create(monto, `EGRESO ANULACION DE VENTA NO. ${venta.id} CON COBRO NO.${cobro.id}`, 2, caja, false)  
    return cobro;
  }
}



/* return await this.ventasRepository.repository.createQueryBuilder("venta")            
.innerJoinAndSelect("venta.cliente", "cliente")
.innerJoinAndSelect("venta.detalle", "detalle")
.innerJoin(
  (subQuery) => {
      return subQuery
          .innerJoinAndSelect("venta.detalle", "detalle")
          .select("SUM(detalle.cantidad*detalle.precio_venta)")
  },"total")
.select(["venta.id", "cliente.nombre", "detalle"])
.groupBy("venta.id,cliente.id, detalle.id")
.getMany() */