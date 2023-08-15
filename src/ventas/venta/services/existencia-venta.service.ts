import { Injectable } from '@nestjs/common';
import { Inventario } from 'src/almacen/producto/entities/inventario.entity';
import { getRepository } from 'typeorm';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { CreateVentaDto } from '../dto/create-venta.dto';
import { CreateTrasladoDto } from 'src/almacen/traslado/dto/create-traslado.dto';

@Injectable()
export class ExistenciaVentaService {
    constructor(){}

    @Transactional({propagation:Propagation.MANDATORY})
    async ingresoVenta(dto:any){
        const inventarioRepository = getRepository(Inventario)
        
        for (let i = 0; i < dto.detalle.length; i++) {
            const inventario = await inventarioRepository.find({
                where:{sucursal:dto.sucursal.id,producto:dto.detalle[i].producto}
            })
            inventario[0].cantidad = (+inventario[0].cantidad) - (dto.detalle[i].cantidad)
            await inventarioRepository.save(inventario)
        }
        return
    }

    @Transactional({propagation:Propagation.MANDATORY})
    async anulacionVenta(dto:CreateVentaDto){
        const inventarioRepository = getRepository(Inventario)
        
        for (let i = 0; i < dto.detalle.length; i++) {
            const inventario = await inventarioRepository.find({
                where:{sucursal:dto.sucursal.id,producto:dto.detalle[i].producto}
            })
            inventario[0].cantidad = (+inventario[0].cantidad) + (dto.detalle[i].cantidad)
            await inventarioRepository.save(inventario)
        }
        return   
    }

    @Transactional({propagation:Propagation.MANDATORY})
    async movimientosPorTraslado(traslado:CreateTrasladoDto){
        const inventarioRepository = getRepository(Inventario)
        
        for (let i = 0; i < traslado.detalle.length; i++) {
            const inventarioDescuento = await inventarioRepository.find({
                where:{sucursal:traslado.sucursalResp.id,producto:traslado.detalle[i].producto}
            })
            inventarioDescuento[0].cantidad = (+inventarioDescuento[0].cantidad) - (traslado.detalle[i].cantidad)
            await inventarioRepository.save(inventarioDescuento)
            
            const inventarioSuma = await inventarioRepository.find({
                where:{sucursal:traslado.sucursalSol.id,producto:traslado.detalle[i].producto}
            })
            inventarioSuma[0].cantidad = (+inventarioSuma[0].cantidad) + (traslado.detalle[i].cantidad)
            await inventarioRepository.save(inventarioSuma)
        }
        return   
    }
}
