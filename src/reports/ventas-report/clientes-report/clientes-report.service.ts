import { Injectable } from '@nestjs/common';
import { ClienteService } from 'src/ventas/cliente/cliente.service';
import { User } from 'src/user/entities/user.entity';
import { ResultReportGeneric } from 'src/reports/interface/interfaces-resul';
import { CuentasPorCobrarService } from 'src/creditos/cuentas-por-cobrar/cuentas-por-cobrar.service';

@Injectable()
export class ClientesReportService {

    constructor(private readonly clienteService:ClienteService,
                private readonly cuentasPorCobrarService:CuentasPorCobrarService){}

    async findAllClientes(user:User){
        const data = await this.clienteService.findAll()

        const listClientes:ResultReportGeneric ={
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
            },

            result:data
        }

        return listClientes
    }

/*     async creditosClientes(user:User){
        const data = await this.cuentasPorCobrarService
        .getTodostCuentasPorCobrar(user.empleado.sucursal)

        var total:number = 0
        data.forEach(a=>{
            total += Number(a.saldo)
        })

        const resultadoCreditosActivos:ResultReportGeneric = {
      header:{
      documento: 'Creditos a Clientes Activos',
      sucursal:{
        nombre:user.empleado.sucursal.nombre,
        direccion:user.empleado.direccion
      },
      empleado:{
        nombre:user.empleado.nombre,
        apellido:user.empleado.apellido
      },
      },
        result:data,
        total:total
      }

      return resultadoCreditosActivos
    } */
    
}
