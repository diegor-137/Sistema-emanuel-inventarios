import { Injectable, NotFoundException } from '@nestjs/common';
import { DataService } from '../../common/service/common.service';
import { Proveedor } from './entity/proveedor.entity';
import { EditProveedorDto } from './dto';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
<<<<<<< HEAD
import { Empleado } from 'src/recursos-humanos/empleado/entity/empleado.entity';
import { CreditoProveedorService } from '../../creditos/credito-proveedor/credito-proveedor.service';
=======
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
>>>>>>> 34de35d63b5379a90ec65886837da6d76c32b55f

@Injectable()
export class ProveedorService{

    constructor(
        @InjectRepository(Proveedor)
        public readonly repository:Repository<Proveedor>
    ){}

    async findAll(){
        return await this.repository.find({
            where:[{
                estado:true
            }]
        })
    }

    async findById(id:number){
        const data = await this.repository.findOne(id);
        if(!data) throw new NotFoundException(`El registro no fue encontrado`);
        return data;
    }

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

<<<<<<< HEAD
    async findTodos(idSucursal:number){
        const proveedor = await this.repository.createQueryBuilder('proveedor')
                .leftJoinAndSelect('proveedor.credito', 'credito', `credito.sucursal.id = ${idSucursal}`)                                                    
                .getMany()    
        return proveedor
    }

=======
    async deleteById(id:number){
        const data = await this.findById(id)
        data.estado = false
        return await this.repository.save(data)
    }

    async findByName(nombre:string){
        return await this.repository.find({
           where: {
            nombre: ILike(`%${nombre}%`),
            estado: true
          } 
        });
      }
>>>>>>> 34de35d63b5379a90ec65886837da6d76c32b55f
}
