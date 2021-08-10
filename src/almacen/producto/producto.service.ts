import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { DataService } from '../../common/service/common.service';
import { Producto } from './entities/producto.entity';
import { join } from 'path';
import { FotoDto } from './dto/foto.dto';
import  fs  from "fs";

@Injectable()
export class ProductoService extends DataService(Producto) {

  async products(){
    return await this.repository.find({relations: ['categoria', 'marca', 'precios', 'precios.tipoPrecio']});
  }

  async findProductImages(id:number){
    return await this.repository.findOne(id, {relations: ['fotos']});      
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) { 
  }
  async uploads(files: Express.Multer.File[], producto: CreateProductoDto){
    /* const list=[];  
    files.forEach(a=>{ 
        const images = {nombre:''}
        images.nombre = a.filename
        list.push(images);
      });
      producto.fotos = list; */        
      return await this.repository.save(producto);
  }

  async productImage(idProduc: number, foto:FotoDto, res:any){  
        const {id, nombre} = foto;       
        const productos = await this.findProductImages(idProduc);
        var index:number = productos.fotos.indexOf(productos.fotos.find(a =>a.id === id && a.nombre == nombre));
        if(index === -1) throw new NotFoundException(`La foto no existe/pertenece al producto`);          
        return (res.sendFile(join(process.cwd(), 'uploads/productImages/' + nombre)));        
    }
}
