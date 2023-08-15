import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { VentaService } from 'src/ventas/venta/services/venta.service';
import { finanzasReport } from '../dto/finanzas-report.dto';
import { ResultUtility } from '../interface/interfaces-resul';

@Injectable()
export class FinanzasReportService {


  constructor(private ventaService:VentaService){}

  async utilidadDetallada(start: Date, end:Date, user:User, dto:finanzasReport) {
    const st = new Date(start)
    const en = new Date(end);
    en.setDate(en.getDate() + 1);

    const query = this.ventaService.repository.createQueryBuilder('venta')
            .leftJoinAndSelect('venta.cliente','cliente')
            .leftJoinAndSelect('venta.empleado','empleado')
            .leftJoinAndSelect('venta.detalle','detalle')
            .leftJoinAndSelect('venta.sucursal','sucursal')
            .select(["venta.id as id",
            "venta.created_At",
            "cliente.nombre as cliente",
            "empleado.nombre as nombre",
            "empleado.apellido as apellido",
            "SUM(detalle.cantidad*detalle.precio_venta)as total",
            "SUM(detalle.cantidad*detalle.precio_compra)as totalCompra",
            "SUM((detalle.cantidad*detalle.precio_venta - detalle.cantidad*detalle.precio_compra)) as utilidad",
            ])
            .andWhere("venta.created_at>=:st",{st})
            .andWhere("venta.created_at<:en",{en})
            .andWhere("venta.status = 'PAGADO'")
            .andWhere("venta.sucursal.id = :id", {id:user.empleado.sucursal.id});

    if(dto.cliente)query.andWhere("venta.cliente.id = :idCliente", {idCliente:dto.cliente.id});
    if(dto.empleado.id)query.andWhere("venta.empleado.id = :idEmpleado", {idEmpleado:dto.empleado.id})
            
    const result = await query.groupBy("venta.id,cliente.nombre,sucursal.nombre,venta.created_At,empleado.nombre,empleado.apellido").getRawMany()
    var venta:number=0;
    var compra:number=0;
    var utilidad:number=0;
    result.forEach(data=>{
      venta += Number(data.total)
      compra += Number(data.totalcompra)
      utilidad += Number(data.utilidad)
    })

    const resultUtility:ResultUtility = {
      header:{documento: 'Utiliad detallada por dia',
      sucursal:{
        nombre:user.empleado.sucursal.nombre,
        direccion:user.empleado.direccion
      },
      empleado:{
        nombre:user.empleado.nombre,
        apellido:user.empleado.apellido
      },
      periodo:`${new Date(start).toLocaleDateString("es-gt") } - ${new Date(end).toLocaleDateString("es-gt")}`},
      result : result, 
            venta, 
            compra, 
            utilidad
      }

    return resultUtility;      
  }
}
