import { Injectable } from '@nestjs/common';
import { VentaService } from '../../../ventas/venta/services/venta.service';
import { User } from 'src/user/entities/user.entity';
import { ResultReportGeneric } from 'src/reports/interface/interfaces-resul';

@Injectable()
export class VentasReportService {

    constructor(private readonly ventaService:VentaService){}


    async find(start: Date, end:Date,user:User,dto:any){
    const st = new Date(start)
      const en = new Date(end);
      const data = await this.ventaService.FindAll(start,end,user,dto.status)

        var total:number=0
        data.forEach(data=>{
        total += Number(data.total)
      })
      const listProvedores:ResultReportGeneric = {
      header:{
      documento: 'Listado Ventas',
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
}
