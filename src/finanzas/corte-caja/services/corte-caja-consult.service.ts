import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CorteCaja } from '../entities/corte-caja.entity';


@Injectable()
export class CorteCajaConsultService {


    constructor(
        @InjectRepository(CorteCaja)
        public readonly corteCajaRepository: Repository<CorteCaja>,
      ) {}
    
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
        const corte = await this.corteCajaRepository.createQueryBuilder("corte_caja")
        .leftJoin("corte_caja.empleado", "empleado")
        .leftJoin("corte_caja.caja", "caja")
        .leftJoin("caja.empleado", "cajaEmpleado")
        .leftJoin("corte_caja.corteCajaDetalle", "corteCajaDetalle")
        .select(["corte_caja", "corteCajaDetalle","empleado.nombre", "empleado.apellido", "caja.id", "caja.nombre", "cajaEmpleado.nombre", "cajaEmpleado.apellido"])
        .where({id})
        .orderBy('corteCajaDetalle.id', 'ASC')
        .getOne()
        for (let i = 0; i < corte.corteCajaDetalle.length; i++) {
          corte.corteCajaDetalle[i].monto = Number(corte.corteCajaDetalle[i].monto)
          const element = corte.corteCajaDetalle[i];
          if(element.concepto === 'VENTAS' && corte.corteCajaDetalle[0].concepto ==='SALADO CAJA'){                
            corte.corteCajaDetalle[0].monto -= corte.corteCajaDetalle[i].monto 
          }
          if(element.concepto === 'GASTOS' && corte.corteCajaDetalle[0].concepto ==='SALADO CAJA'){
            corte.corteCajaDetalle[0].monto += corte.corteCajaDetalle[i].monto
          }
          if(element.concepto === 'EGRESOS' && corte.corteCajaDetalle[0].concepto ==='SALADO CAJA'){
            corte.corteCajaDetalle[0].monto += corte.corteCajaDetalle[i].monto
          }
          if(element.concepto === 'INGRESOS' && corte.corteCajaDetalle[0].concepto ==='SALADO CAJA'){
            corte.corteCajaDetalle[0].monto -= corte.corteCajaDetalle[i].monto
          }
          if(element.concepto === 'CUENTAS POR COBRAR' && corte.corteCajaDetalle[0].concepto ==='SALADO CAJA'){
            corte.corteCajaDetalle[0].monto -= corte.corteCajaDetalle[i].monto
          }
        }
        return corte;
      }  

}