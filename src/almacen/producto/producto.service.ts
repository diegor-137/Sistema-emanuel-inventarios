import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { DataService } from '../../common/service/common.service';
import { Producto } from './entities/producto.entity';
import { join } from 'path';
import { FotoDto } from './dto/foto.dto';
import { getConnection, getRepository } from 'typeorm';
import { Sucursal } from '../../sucursal/entity/sucursal.entity';
import { Inventario } from './entities/inventario.entity';

@Injectable()
export class ProductoService extends DataService(Producto) {

  async products(){
    return await this.repository.find({relations: ['categoria', 'marca', 'precios', 'precios.tipoPrecio']});
  }

  async findProductImages(id:number){
    return await this.repository.findOne(id, {relations: ['fotos']});      
  }

  async update(id: number, dto: UpdateProductoDto) {
    const connection = getConnection()
    const queryRunner = connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
        const data = await this.findById(id)
        const Edited = Object.assign(data,dto)
        const saved = await queryRunner.manager.save(Edited)
        await queryRunner.commitTransaction()
        await queryRunner.release()
        return saved
    } catch (err) {
        await queryRunner.rollbackTransaction()
        await queryRunner.release()
        return err
    }finally{
        await queryRunner.release()   
    }
  }
  
  async uploads(files: Express.Multer.File[], producto:CreateProductoDto){

        const connection = getConnection()
        const queryRunner = connection.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const creado = this.repository.create(producto)
            const saved =  await queryRunner.manager.save(creado)
            await queryRunner.commitTransaction()
            await queryRunner.release()
            this.afterInsert(saved)
            return saved
            
        } catch (err) {
            await queryRunner.rollbackTransaction()
            await queryRunner.release()
            return err.detail
        }finally{
            await queryRunner.release()   
        }

    /* const list=[];  
    files.forEach(a=>{ 
        const images = {nombre:''}
        images.nombre = a.filename
        list.push(images);
      });
      producto.fotos = list; */

      //return await this.repository.save(producto);
  }


  async afterInsert(pro:Producto){
    /*
    Esta funcion, crear precios por defecto cuando se cree un producto,
    dependiendo cuantos tipos de precio existan
    */
    const sucRep = getRepository(Sucursal)
    const sucursal = await sucRep.find()
    for (let i = 0; i < sucursal.length; i++) {
       await getConnection().createQueryBuilder()
        .insert().into(Inventario)
        .values([
            {producto:pro,sucursal:sucursal[i]}
        ]).execute()

    }

    
}

  async productImage(idProduc: number, foto:FotoDto, res:any){  
        const {id, nombre} = foto;       
        const productos = await this.findProductImages(idProduc);
        var index:number = productos.fotos.indexOf(productos.fotos.find(a =>a.id === id && a.nombre == nombre));
        if(index === -1) throw new NotFoundException(`La foto no existe/pertenece al producto`);          
        return (res.sendFile(join(process.cwd(), 'uploads/productImages/' + nombre)));        
    } 
}
