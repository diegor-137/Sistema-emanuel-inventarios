import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CobroService } from '../cobro/cobro.service';
import { GastosService } from '../gastos/gastos.service';
import { MovimientoCajaService } from '../movimiento-caja/movimiento-caja.service';
import { CreateCorteCajaDetalle, CreateCorteCajaDto } from './dto/create-corte-caja.dto';
import { CorteCaja } from './entities/corte-caja.entity';


@Injectable()
export class CorteCajaService {

  constructor(
    @InjectRepository(CorteCaja)
    public readonly corteCajaRepository: Repository<CorteCaja>,
    private readonly movimientoCajaService: MovimientoCajaService,
    private readonly cobroService:CobroService,
    //private readonly gastosService:GastosService
  ) {}

  async create(createCorteCajaDto: CreateCorteCajaDto, monto:number){
    let {caja} = createCorteCajaDto    
    const {balance} = await this.movimientoCajaService.ultimoMovimiento(caja.id);
    const {total} = await this.totalCobro(caja.id);
    //const {gasto} = await this.totalGasto(caja.id);
    let detalle: CreateCorteCajaDetalle[] = [
      {monto: balance, concepto: 'SALADO CAJA', type :true},
      {monto: total, concepto: 'VENTAS', type :true},      
      {monto, concepto: 'MONTO A RETIRAR', type :false},
      //{monto:gasto, concepto: 'GASTOS', type :false},
    ]
    const data = detalle.filter((det)=>det.monto !== 0 && det.monto != null)
    createCorteCajaDto.corteCajaDetalle = data;
    const corte = await this.corteCajaRepository.save(createCorteCajaDto);
    await this.cobros(corte);
    //await this.gastos(corte)    
    await this.movimientoCajaService.create(monto, `EGRESO CORTE NO. ${corte.id}`, 2, createCorteCajaDto.caja, false)
  }

  //TODO:USANDO
  async lastCorte(id:number){
    return await this.corteCajaRepository.createQueryBuilder("corte_caja")
    .leftJoinAndSelect("corte_caja.empleado", "empleado")
    .select(["corte_caja.fechas", "corte_caja.id", "empleado.nombre", "empleado.apellido"])
    .where("corte_caja.caja.id = :id", {id})
    .andWhere((qb)=>{const subQuery= qb.subQuery()
                  .select("MAX(corte_caja.fecha)", "fecha")
                  .from(CorteCaja, "corte_caja")
                  .where("corte_caja.caja.id = :id", {id})
                  .getQuery()
                  return "corte_caja.fecha = " + subQuery})
    .getOne() 
  }  

  async totalCobro(id:number){
    return await this.cobroService.cobroRepository.createQueryBuilder("cobro")                                
    .innerJoinAndSelect("cobro.detalleCobro", "detalle")
    .leftJoinAndSelect("cobro.caja", "caja")
    .leftJoinAndSelect("cobro.corteCaja", "corte")
    .select('SUM(detalle.cantidad)', 'total')
    .where('caja.id = :id', {id})
    .andWhere('corte.id is null')
    .getRawOne() 
  }

 /*  async totalGasto(id:number){
    return await this.gastosService.gastoRepository.createQueryBuilder("gastos")                                
    .leftJoinAndSelect("gastos.caja", "caja")
    .leftJoinAndSelect("gastos.corteCaja", "corte")
    .select('SUM(gastos.monto)', 'gasto')
    .where('caja.id = :id', {id})
    .andWhere('corte.id is null')
    .getRawOne() 
  } */

  async cobros(corte:CorteCaja ){
    const cobros = await this.cobroService.cobroRepository.find({
      relations: ["corteCaja"], 
      where: { caja: {id: corte.caja.id}, corteCaja: {id: IsNull()}}
    });
    if(cobros) {
      cobros.map(cobro=> cobro.corteCaja = corte)
      await this.cobroService.cobroRepository.save(cobros);
    };
  }

  /* async gastos(corte:CorteCaja ){
    const gastos = await this.gastosService.gastoRepository.find({
      relations: ["corteCaja"], 
      where: { caja: {id: corte.caja.id}, corteCaja: {id: IsNull()}}
    });
    if(gastos) {
      gastos.map(cobro=> cobro.corteCaja = corte)
      await this.gastosService.gastoRepository.save(gastos);
    };
  } */

  //FIXME: ARREGLAR ESTA FUNCION CON CAJA
  async findAll(start: Date, end:Date, id:number) {
    const st = new Date(start)
    const en = new Date(end)
    en.setDate(en.getDate() + 1);
    return await this.corteCajaRepository.createQueryBuilder("corte_caja")
    .leftJoin("corte_caja.empleado", "empleado")
    .leftJoin("corte_caja.caja", "caja")
    .leftJoin("corte_caja.corteCajaDetalle", "corteCajaDetalle")
    .select(["corte_caja", "empleado.nombre", "empleado.apellido", "corteCajaDetalle"])
    .where("caja.id = :id", {id})
    .andWhere("corte_caja.fechas >= :st", {st})
    .andWhere("corte_caja.fechas < :en", {en})
    .having("corteCajaDetalle.concepto = :string", {string: "MONTO A RETIRAR"})
    .orderBy("corte_caja.fechas", "ASC")
    .groupBy("corte_caja.id, empleado.id, corteCajaDetalle.id")
    .getMany()
  }

  async findOne(id:number){
    return await this.corteCajaRepository.createQueryBuilder("corte_caja")
    .leftJoin("corte_caja.empleado", "empleado")
    .leftJoin("corte_caja.caja", "caja")
    .leftJoin("caja.empleado", "cajaEmpleado")
    .leftJoin("corte_caja.corteCajaDetalle", "corteCajaDetalle")
    .select(["corte_caja", "corteCajaDetalle","empleado.nombre", "empleado.apellido", "caja.lugar", "cajaEmpleado.nombre", "cajaEmpleado.apellido"])
    .where({id})
    .orderBy('corteCajaDetalle.id', 'ASC')
    .getOne()
  }
}


//const ultimoCorte = await getManager().query(`SELECT "balance", "fecha" FROM corte_caja where "cajaId" = ${caja.id} AND fecha = (SELECT MAX(fecha) FROM corte_caja)`)
/* const ultimoCorte = await this.corteCajaRepository.createQueryBuilder()
    .select("corte_caja").from(CorteCaja, "corte_caja")
    .where((qb)=>{const subQuery= qb.subQuery()
                  .select("MAX(corte_caja.fecha)", "fecha").from(CorteCaja, "corte_caja")
                  .getQuery()
                  return "corte_caja.fecha = " + subQuery  
                 }).getOne() */



  /* async totalCobro(id:number){
    return await this.cobroService.cobroRepository.createQueryBuilder("cobro")                                
    .innerJoinAndSelect("cobro.detalleCobro", "detalle")
    .leftJoinAndSelect("cobro.caja", "caja")
    .leftJoinAndSelect("cobro.corteCaja", "corte")
    .select('SUM(detalle.cantidad)', 'total')
    .andWhere('caja.id = :id', {id})
    .andWhere('corte.id is null')
    .getRawOne() 
  }

  async ultimoCorte(id:number){
    return await this.corteCajaRepository.createQueryBuilder("corte_caja")
    .innerJoinAndSelect("corte_caja.caja", "caja")
    .select("corte_caja")
    .where("caja.id = :id", {id})
    .andWhere((qb)=>{const subQuery= qb.subQuery()
                  .select("MAX(corte_caja.fecha)", "fecha")
                  .from(CorteCaja, "corte_caja")
                  .getQuery()
                  return "corte_caja.fecha = " + subQuery  
                 })
    .getOne() 
  }

  async lastCorte(id:number){
    return await this.corteCajaRepository.createQueryBuilder("corte_caja")
    .leftJoinAndSelect("corte_caja.caja", "caja")
    .leftJoinAndSelect("corte_caja.empleado", "empleado")
    .select(["corte_caja.fechas", "corte_caja.id", "empleado.nombre", "empleado.apellido"])
    .where("caja.id = :id", {id})
    .andWhere((qb)=>{const subQuery= qb.subQuery()
                  .select("MAX(corte_caja.fecha)", "fecha")
                  .from(CorteCaja, "corte_caja")
                  .getQuery()
                  return "corte_caja.fecha = " + subQuery  
                 })
    .getOne() 
  }

  async create(createCorteCajaDto: CreateCorteCajaDto) {
    let {caja} = createCorteCajaDto 
    const balance = await this.getBalance(caja.id);   
    createCorteCajaDto.balance = balance - createCorteCajaDto.monto ;            
    const corte = await this.corteCajaRepository.save(createCorteCajaDto);
    const cobros = await this.cobroService.cobroRepository.find({
      relations: ["corteCaja"], 
      where: { caja: {id: caja.id}, corteCaja: {id: IsNull()}}
    });
    if(cobros) cobros.map(cobro=> cobro.corteCaja = corte);
    await this.cobroService.cobroRepository.save(cobros);
    return corte;   
  }

  async getBalance(id:number){
    const {total} = await this.totalCobro(id);       
    const ultimoCorte = await this.ultimoCorte(id)
    const balance = Number(ultimoCorte.balance) + Number(total);     
    return balance;
  }

  async findAll() {
    return await this.corteCajaRepository.createQueryBuilder("corte_caja")
    .leftJoinAndSelect("corte_caja.empleado", "empleado")
    .leftJoinAndSelect("corte_caja.caja", "caja")
    .select(["corte_caja", "empleado.nombre", "empleado.apellido"])
    .where("caja.id = :id", {id:19})
    .orderBy("corte_caja.fechas", "ASC")
    .getMany()
  } */
