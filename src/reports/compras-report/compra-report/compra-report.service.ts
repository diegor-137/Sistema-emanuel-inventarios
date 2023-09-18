import { Injectable } from '@nestjs/common';
import { CreateCompraReportDto } from './dto/create-compra-report.dto';
import { UpdateCompraReportDto } from './dto/update-compra-report.dto';
import { CompraService } from 'src/compras/compra/services/compra.service';
import { User } from 'src/user/entities/user.entity';
import { ResultReportGeneric } from 'src/reports/interface/interfaces-resul';

@Injectable()
export class CompraReportService {
      constructor(    
      private readonly compraService:CompraService,
      ){}

  async find(start: Date, end:Date,user:User) {
      const st = new Date(start)
      const en = new Date(end);
      const data = await this.compraService.findAll(start,end,user,true)

      var total:number=0
      data.forEach(data=>{
        total += Number(data.total)
      })
      const listProvedores:ResultReportGeneric = {
      header:{
      documento: 'Listado Compras',
      sucursal:{
        nombre:user.empleado.sucursal.nombre,
        direccion:user.empleado.direccion
      },
      empleado:{
        nombre:user.empleado.nombre,
        apellido:user.empleado.apellido
      },
      periodo:`${new Date(start).toLocaleDateString("es-gt") } - ${new Date(end).toLocaleDateString("es-gt")}`
      },
        result:data,
        total:total
      }
    return listProvedores
  }


      async findComprasCanceladas(start: Date, end:Date,user:User){

        const data = await this.compraService.findAll(start,end,user,false)
        const st = new Date(start)
        const en = new Date(end)

      var total:number=0
      data.forEach(data=>{
        total += Number(data.total)
      })

        const listComprasCanceladas:ResultReportGeneric = {
      header:{
      documento: 'Listado Compras canceladas',
      sucursal:{
        nombre:user.empleado.sucursal.nombre,
        direccion:user.empleado.direccion
      },
      empleado:{
        nombre:user.empleado.nombre,
        apellido:user.empleado.apellido
      },
      periodo:`${new Date(start).toLocaleDateString("es-gt") } - ${new Date(end).toLocaleDateString("es-gt")}`
      },
        result:data
      }
      return listComprasCanceladas
    }

}
