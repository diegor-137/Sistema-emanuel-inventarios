import { Injectable } from '@nestjs/common';
import { ProveedorService } from '../../../compras/proveedor/proveedor.service';
import { ResultReportGeneric } from 'src/reports/interface/interfaces-resul';
import { User } from 'src/user/entities/user.entity';
import { getRepository } from 'typeorm';
import { CuentaPorPagarDetalle } from 'src/creditos/cuentas-por-pagar/entities/cuenta-por-pagar-details.entity';

@Injectable()
export class ProveedoresReportService {
  
    constructor(private readonly proveedorService:ProveedorService){}
  
    async findAll(user:User){
      const data = await this.proveedorService.repository.find({
        relations:["credito"],
        where:[{estado:true}]
      })
      const listProvedores:ResultReportGeneric = {
      header:{
      documento: 'Listado General Proveedores',
      sucursal:{
        nombre:user.empleado.sucursal.nombre,
        direccion:user.empleado.direccion
      },
      empleado:{
        nombre:user.empleado.nombre,
        apellido:user.empleado.apellido
      },
      },
        result:data
      }
      return listProvedores
    }

    async creditosActivos(user:User){
      console.log(user.empleado.sucursal.id)
      var suc = user.empleado.sucursal.id
      const data = await this.proveedorService.repository
      .createQueryBuilder('proveedor')
      .leftJoinAndSelect("proveedor.cuentaPorPagar","cuentaPorPagar","cuentaPorPagar.sucursal.id = :id",{id:suc})
      .leftJoinAndSelect("cuentaPorPagar.compra","compra")
      .leftJoinAndSelect('compra.detalle', 'detalle')
      .select(["proveedor.id as proveedorId","proveedor.nombre as proveedor","cuentaPorPagar.id as idCuenta","cuentaPorPagar.fechaInicio as fechaInicio",
              "cuentaPorPagar.fechaFinal as fechaFinal",
                "compra.id as compra",'SUM(detalle.cantidad*detalle.precio) AS total'])
        .addSelect((sub)=>{
            return sub.select("SUM(cuentas_por_pagar_det.monto)", "pagos")
                      .from(CuentaPorPagarDetalle, "cuentas_por_pagar_det")
                      .where("cuentas_por_pagar_det.cuentaPorPagar = cuentaPorPagar.id")
        }, "pagos")     
      .where("cuentaPorPagar.estado=false")
      .groupBy('proveedor.id, proveedor.nombre, cuentaPorPagar.id, cuentaPorPagar.fechaInicio, cuentaPorPagar.fechaFinal, compra.id')
      const resultado = await data.getRawMany()
      resultado.forEach(r=>r.saldo = r.total-r.pagos)   
      var total:number=0
      resultado.forEach(data=>{
        total += Number(data.saldo)
      })

      const resultadoCreditosActivos:ResultReportGeneric = {
      header:{
      documento: 'Creditos a Proveedores Activos',
      sucursal:{
        nombre:user.empleado.sucursal.nombre,
        direccion:user.empleado.direccion
      },
      empleado:{
        nombre:user.empleado.nombre,
        apellido:user.empleado.apellido
      },
      },
        result:resultado,
        total:total
      }

      return resultadoCreditosActivos
    }


  }
