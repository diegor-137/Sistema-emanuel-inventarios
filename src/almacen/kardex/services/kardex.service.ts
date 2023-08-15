import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Kardex } from '../entity/kardex.entity';
import { Repository } from 'typeorm';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { CreateKardexDto } from '../dtos/kardex.dto';
import { Sucursal } from 'src/sucursal/sucursal/entity/sucursal.entity';

@Injectable()
export class KardexService {

    constructor(
        @InjectRepository(Kardex)
        private readonly repository: Repository<Kardex>,
      ) {}
    
      @Transactional({propagation: Propagation.MANDATORY})
      async create(num:number,concepto:string,sucursal:Sucursal,transaccion:number,detalleTransaccion:any){
        
        for (let i = 0; i < detalleTransaccion.length; i++) {
          const kardex:CreateKardexDto = {
            concepto, 
            transaccion, 
            cantidad:detalleTransaccion[0].cantidad,
            nuevaCantidad:0,
            producto:detalleTransaccion[0].producto, 
            sucursal
          }
          const ultimoRegistro = await this.ultimoMovimiento(kardex.producto,sucursal.id)
          if (ultimoRegistro.length===0) {
            kardex.nuevaCantidad = kardex.cantidad
          }
          else{
            switch (num) {
              //en caso que sea ingreso
              case 1:kardex.nuevaCantidad = Number(kardex.cantidad) + Number(ultimoRegistro[0].nuevaCantidad)
                break;
              //en caso que sea egreso
              case 2: kardex.nuevaCantidad = Number(ultimoRegistro[0].nuevaCantidad) - Number(kardex.cantidad)  
                break;
            }
          }

          const registroCreadoKardex = await this.repository.create(kardex)
          const registroGuardad = this.repository.save(registroCreadoKardex)
        }
        return
      }

      async ultimoMovimiento(idProd:any,idSuc:number){
        return this.repository.createQueryBuilder("kardex")
        .andWhere("kardex.sucursal=:idSuc",{idSuc})
        .andWhere("kardex.producto=:idProd",{idProd})
        .andWhere((qb)=>{const subQuery= qb.subQuery()
          .select("MAX(kardex.createdAt)", "createdAt")
          .from(Kardex, "kardex")                  
          .andWhere("kardex.sucursal=:idSuc",{idSuc})
          .andWhere("kardex.producto=:idProd",{idProd})
          .getQuery()
          return "kardex.createdAt = " + subQuery})
        
        .getMany()
      }
}
