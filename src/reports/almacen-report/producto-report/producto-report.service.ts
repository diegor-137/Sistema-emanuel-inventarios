import { Injectable } from '@nestjs/common';
import { ProductoService } from 'src/almacen/producto/services/producto.service';
import { User } from 'src/user/entities/user.entity';
import { ListGeneralProd, Header } from '../interfaces/almacenReporte-interfaces';

@Injectable()
export class ProductoReportService {

      constructor(    
      private readonly productoService:ProductoService,
){}

  async findAll(user:User){
    //const data = await this.productoService.findAll(user)
    const data = await this.productoService.repository.find({
      relations:["marca","categoria"],
      where:[{estado:true}]
    })
    const listGeneralProd:ListGeneralProd = {
      header:{
    documento: 'Listado General Productos',
      sucursal:{
        nombre:user.empleado.sucursal.nombre,
        direccion:user.empleado.direccion
      },
      empleado:{
        nombre:user.empleado.nombre,
        apellido:user.empleado.apellido
      },
      },
      resultado:data
    }
    return listGeneralProd
  }

  async findProductosEliminados(user:User){
    const data = await this.productoService.repository.find({
      relations:["marca","categoria"],
      where:[{estado:false}]
    })
    const listGeneralProd:ListGeneralProd = {
      header:{
      documento: 'Listado Productos Eliminados',
      sucursal:{
        nombre:user.empleado.sucursal.nombre,
        direccion:user.empleado.direccion
      },
      empleado:{
        nombre:user.empleado.nombre,
        apellido:user.empleado.apellido
      },
      },
      resultado:data
    }
    return listGeneralProd
  }

  async findListadoPrecios(user:User){
    const data = await this.productoService.repository.find({
      relations:["precio","costo","precio.tipoPrecio"],
      where:[{estado:true}]
    })

    const listGeneralProd:ListGeneralProd = {
      header:{
      documento: 'Listado Precios',
      sucursal:{
        nombre:user.empleado.sucursal.nombre,
        direccion:user.empleado.direccion
      },
      empleado:{
        nombre:user.empleado.nombre,
        apellido:user.empleado.apellido
      },
      },
      resultado:data
    }
    return listGeneralProd
  }

}
