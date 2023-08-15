import { Injectable } from '@nestjs/common';
import { Inventario } from 'src/almacen/producto/entities/inventario.entity';
import { Producto } from 'src/almacen/producto/entities/producto.entity';
import { getRepository } from 'typeorm';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { Costo } from 'src/almacen/precio/entities/costo.entity';
import { CostoService } from 'src/almacen/precio/services/costo.service';

@Injectable()
export class ExistenciaCompraService {
    constructor(
        private readonly costoService:CostoService,
    ){}

    @Transactional({propagation:Propagation.MANDATORY})
    async ingresoCompra(dto:any){
        const costoRepository = getRepository(Costo)
        const inventarioRepository = getRepository(Inventario)
        for (let i = 0; i < dto.detalle.length; i++) {
            
            const inventario = await inventarioRepository.find({
                where:{sucursal: dto.sucursal.id,producto:dto.detalle[i].producto}})
           
            //const producto:any = await productoRepository.find({
            //    where:{id:dto.detalle[i].producto}})

            //verificamos si el producto tiene registo de costo creado o no
            //en caso que no tenga, crea el registro y luego pobla la constante
            let prueba = await costoRepository.find({
                where:{region:dto.sucursal.region.id,producto:dto.detalle[i].producto}}) 
            if (prueba.length === 0) {
                this.costoService.createNewCosto(dto.detalle[i].producto,dto.sucursal.region.id)    
                }

            const costo = await costoRepository.find({
                    where:{region:dto.sucursal.region.id,producto:dto.detalle[i].producto}})
            //console.log 
            //('de nuevo consulta:',
            //costo)


            let nuevaInversion = (inventario[0].cantidad * costo[0].costo_prom) + 
                                 ((+dto.detalle[i].cantidad) * (+dto.detalle[i].precio)) 
            let nuevaExistencia = (+dto.detalle[i].cantidad) + (+inventario[0].cantidad)
            
            let nuevoCosto = nuevaInversion / nuevaExistencia
            
            costo[0].costo_prom_old = +costo[0].costo_prom
            costo[0].ultimo_precio = dto.detalle[i].precio
            costo[0].costo_prom = nuevoCosto
            await costoRepository.save(costo)

            inventario[0].cantidad = nuevaExistencia
            await inventarioRepository.save(inventario)
            
        }
        return 
    }

    @Transactional({propagation:Propagation.MANDATORY})
    async anulacionCompra(dto:any){
     
        //return console.log(dto)
        const productoRepository = getRepository(Producto)
        const inventarioRepository = getRepository(Inventario)
        //console.log(event.entity.detalle)
        for (let i = 0; i < dto.detalle.length; i++) {
            
            //console.log(dto.detalle[i].producto.id)
            //console.log(dto.sucursal.id)
            //return

            const inventario = await inventarioRepository.find({
                where:{sucursal: dto.sucursal.id,producto:dto.detalle[i].producto.id}})
           
            const producto:any = await productoRepository.find({
                where:{id:dto.detalle[i].producto.id}})
 
                let nuevaExistencia = (+inventario[0].cantidad) - (+dto.detalle[0].cantidad)

                if (nuevaExistencia === 0) {
                    producto[0].ultimo_precio = producto[0].costo_prom_old
                    producto[0].costo_prom = producto[0].costo_prom_old
                    await productoRepository.save(producto)
        
                    inventario[0].cantidad =  nuevaExistencia
                    await inventarioRepository.save(inventario)  
                }

                if (nuevaExistencia < 0) {
                    throw new Error('No se puede anular, productos de dicha factura ya fueron egresadas');
                }
                
                let nuevaInversion = (inventario[0].cantidad * producto[0].costo_prom) - 
                ((+dto.detalle[i].cantidad) * (+dto.detalle[i].precio))         

                let nuevoCosto = nuevaInversion / nuevaExistencia
                console.log(nuevoCosto)

            producto[0].ultimo_precio = producto[0].costo_prom_old
            producto[0].costo_prom = nuevoCosto
            await productoRepository.save(producto)

            inventario[0].cantidad =  nuevaExistencia
            await inventarioRepository.save(inventario)         
        }
        return    
    }
}
