import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VentaService } from 'src/ventas/venta/venta.service';
import { Repository } from 'typeorm';
import { MovimientoCajaService } from '../movimiento-caja/movimiento-caja.service';
import { CreateCobroDto } from './dto/create-cobro.dto';
import { UpdateCobroDto } from './dto/update-cobro.dto';
import { Cobro } from './entities/cobro.entity';

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
    private readonly movimientoCajaService: MovimientoCajaService
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

  async findVentaToday() {
    return await this.ventasRepository.repository.createQueryBuilder("venta")            
    .leftJoinAndSelect("venta.cliente", "cliente")
    .leftJoinAndSelect("venta.detalle", "detalle")
    .select(["venta.id as id", "cliente.nombre as cliente", "venta.created_At as fecha", "venta.status as status", "SUM(detalle.cantidad*detalle.precio_venta)as total"])
    /* .andWhere("venta.created_At >= :start", {start})    
    .andWhere("venta.created_At < :end", {end}) */    
    .andWhere("venta.status = 'PENDIENTE'")
    .groupBy("venta.id,cliente.nombre,venta.created_At,venta.status")
    .getRawMany()    
  }

  async findAllCobros(){
    console.log('holaaaa');
      
      return await this.ventasRepository.repository.createQueryBuilder("venta") 
        .leftJoinAndSelect("venta.cliente","cliente")
        .leftJoinAndSelect("venta.detalle","detalle")
        .innerJoinAndSelect("venta.cobro","cobro")
        .select(["venta.id as id", "cliente.nombre as cliente","venta.created_At as fecha", "venta.status as status", 
        "SUM(detalle.cantidad*detalle.precio_venta)as total", "cobro.id as idCobro"])
        .andWhere("venta.created_At >= :start", {start})    
        .andWhere("venta.created_At < :end", {end}) 
        .groupBy("venta.id,cliente.nombre,venta.created_At,venta.status,cobro.id")
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
  
  async remove(id: number) {
    const cobro = await this.cobroRepository.findOne(id, {loadRelationIds:true})
    const venta = await this.ventasRepository.repository.findOne(cobro.venta);
    venta.status = 'PENDIENTE'
    await this.ventasRepository.repository.save(venta);
    return await this.cobroRepository.remove(cobro);
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