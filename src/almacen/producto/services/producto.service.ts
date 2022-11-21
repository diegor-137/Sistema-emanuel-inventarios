import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { UpdateProductoDto } from '../dto/update-producto.dto';
import { DataService } from '../../../common/service/common.service';
import { Producto } from '../entities/producto.entity';
import { join } from 'path';
import { FotoDto } from '../dto/foto.dto';
import { getConnection, getManager, getRepository } from 'typeorm';
import { Sucursal } from '../../../sucursal/entity/sucursal.entity';
import { Inventario } from '../entities/inventario.entity';
import { User } from 'src/user/entities/user.entity';
import { InventarioService } from './inventario.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class ProductoService extends DataService(Producto) {
    constructor(private readonly inventario:InventarioService){super()}

  async products(){
    return await this.repository.find({relations: ['categoria', 'marca','precio','precio.tipoPrecio']});
  }

  //Se usa para llamaer los productos disponibles en los modulos de ventas y compras
  async prodPorSucursal(user:User){
    return await getRepository(Producto)
    .createQueryBuilder("producto")
    .leftJoinAndSelect("producto.categoria","categoria")
    .leftJoinAndSelect("producto.marca","marca")
    .leftJoinAndSelect("producto.precio","precio")
    .leftJoinAndSelect("precio.tipoPrecio","tipoPrecio")
    .leftJoinAndSelect("producto.inventario","inventario")
    .leftJoinAndSelect("inventario.sucursal","sucursal")
    .where("sucursal.id =:id",{id:user.empleado.sucursal.id})
    .getMany()
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

  @Transactional()
  async uploads(files: Express.Multer.File[], producto:CreateProductoDto){
            const creado = this.repository.create(producto)
            const saved =  await this.repository.save(creado)
            await this.inventario.afterCreateNewProd(saved)
            return saved
  }

  async productImage(idProduc: number, foto:FotoDto, res:any){  
        const {id, nombre} = foto;       
        const productos = await this.findProductImages(idProduc);
        var index:number = productos.fotos.indexOf(productos.fotos.find(a =>a.id === id && a.nombre == nombre));
        if(index === -1) throw new NotFoundException(`La foto no existe/pertenece al producto`);          
        return (res.sendFile(join(process.cwd(), 'uploads/productImages/' + nombre)));        
    } 
}
