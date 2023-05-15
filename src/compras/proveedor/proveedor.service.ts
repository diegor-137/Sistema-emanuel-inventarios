import { Injectable } from '@nestjs/common';
import { DataService } from '../../common/service/common.service';
import { Proveedor } from './entity/proveedor.entity';
import { EditProveedorDto } from './dto';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { Empleado } from 'src/recursos-humanos/empleado/entity/empleado.entity';
import { CreditoProveedorService } from '../../creditos/credito-proveedor/credito-proveedor.service';

@Injectable()
export class ProveedorService extends DataService(Proveedor){

    constructor(
        private readonly creditoProveedorService:CreditoProveedorService
    ){
        super()
    }

    async createOne(dto:CreateProveedorDto, empleado:Empleado){
        const credito = dto.credito[0];
        const proveedor = await this.repository.save(dto)
        delete proveedor.credito
        dto.credit?(
            credito.sucursal = empleado.sucursal,
            credito.proveedor = proveedor,           
            await this.creditoProveedorService.create(credito)
            ):null                  
        return proveedor;   
        
    }
    
    async editOne(id:number, dto:EditProveedorDto, empleado:Empleado){
        const data = await this.findById(id)
        dto.credito && dto.credit === false ? (
            dto.credito[0].estado = false,
            dto.credito[0].proveedor = data,
            dto.credito[0].sucursal = empleado.sucursal,
            await this.creditoProveedorService.create(dto.credito[0])            
            ) : null
            dto.credit?(
                dto.credito[0].proveedor = data,
                dto.credito[0].sucursal = empleado.sucursal,            
                await this.creditoProveedorService.create(dto.credito[0])
                ):null
        const Edited = Object.assign(data,dto)
        delete Edited.credito
        return await this.repository.save(Edited)
    }

    async findTodos(idSucursal:number){
        const proveedor = await this.repository.createQueryBuilder('proveedor')
                .leftJoinAndSelect('proveedor.credito', 'credito', `credito.sucursal.id = ${idSucursal}`)                                                    
                .getMany()    
        return proveedor
    }

}
