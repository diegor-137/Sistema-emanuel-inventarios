import { Injectable } from '@nestjs/common';
import { FilesService } from 'src/files/file.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { DataService } from 'src/common/service/common.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { EditSucursalDto } from './dto/edit-sucursal.dto';
import { Sucursal } from './entity/sucursal.entity';


@Injectable()
export class SucursalService extends DataService(Sucursal){

    constructor(private readonly filesService:FilesService){super()}

    async findAllSucursal(){
        return await this.repository.find({
            relations:["region"]
        })        
    }
    
 
    @Transactional()
    async CreateOne(sucursal : CreateSucursalDto, foto:Express.Multer.File){
        const uploadResult = await this.filesService.uploadPublicFile(foto.buffer, foto.originalname, `${sucursal.nombre}`); 
        sucursal.foto = uploadResult;
        console.log(sucursal);
        
        const sucursalCreated = await this.repository.save(sucursal);
        return sucursalCreated;
    }

    async editOne(id:number ,sucursal : EditSucursalDto){
        const suc = await this.repository.findOne(id)
        const editSuc = Object.assign(suc, sucursal)
        return await this.repository.save(editSuc)
    }

    async findTodos(){
        return await this.repository.find({
            relations: ['foto'],
            where: { 
                estado: true
            }
        })
    }

    async sucursalName(nombre: string) {
        const sucursalResutl = await this.repository
        .findOne({
            where: {
                nombre
            }
        });
        return sucursalResutl;    
      }
}
