import { Injectable } from '@nestjs/common';
import { Inventario } from 'src/almacen/producto/entities/inventario.entity';
import { getRepository } from 'typeorm';
import { Propagation, Transactional } from 'typeorm-transactional-cls-hooked';
import { CreateVentaDto } from '../dto/create-venta.dto';

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
}
