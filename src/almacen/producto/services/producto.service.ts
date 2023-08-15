import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { UpdateProductoDto } from '../dto/update-producto.dto';
import { DataService } from '../../../common/service/common.service';
import { Producto } from '../entities/producto.entity';
import { join } from 'path';
import { FotoDto } from '../dto/foto.dto';
import { Brackets, ILike, Repository, getConnection, getManager, getRepository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { InventarioService } from './inventario.service';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductoService{
    constructor(
      @InjectRepository(Producto)
      public readonly repository:Repository<Producto>,      
      private readonly inventario:InventarioService){}

  async findAll(user:User){
    const data = await getRepository(Producto)
    .createQueryBuilder("producto")
    .leftJoinAndSelect("producto.categoria","categoria")
    .leftJoinAndSelect("producto.marca","marca")
    .leftJoinAndSelect("producto.precio","precio",'precio.region.id = :id',{id:user.empleado.sucursal.region.id})
    .leftJoinAndSelect("precio.tipoPrecio","tipoPrecio")
    .leftJoinAndSelect("precio.region","region")
    .leftJoinAndSelect("producto.costo","costo",'costo.region.id = :id',{id:user.empleado.sucursal.region.id})
    .andWhere("producto.estado = true")
    .getMany()
    return data
    return await this.repository.find({
      relations: ['categoria', 'marca','precio','precio.tipoPrecio','precio.region','costo'],
    });
  }

  async findById(id:number){
    const data = await this.repository.findOne(id);
    if(!data) throw new NotFoundException(`El registro no fue encontrado`);
    return data;
  }


  @Transactional()
  async createOne(files: Express.Multer.File[], producto:CreateProductoDto){
            const creado = this.repository.create(producto)
            const saved =  await this.repository.save(creado)
            await this.inventario.afterCreateNewProd(saved)
            return saved
  }

  async editOne(id: number, dto: UpdateProductoDto) {
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

  async deleteById(id:number){
    const data = await this.findById(id)
    data.estado = false
    return await this.repository.save(data)
  }

  //Se usa para llamaer los productos disponibles en los modulos de ventas y compras
  async prodPorSucursal(user:User){
    var suc = user.empleado.sucursal.id
    var reg = user.empleado.sucursal.region.id
    var resultado = await getRepository(Producto)
    .createQueryBuilder("producto")
    .innerJoinAndSelect("producto.precio","precio","precio.region=:regionId",{regionId:reg})
    .leftJoinAndSelect("producto.costo","costo",'costo.region.id = :regionId',{regionId:reg})
    .innerJoinAndSelect("producto.inventario","inventario","inventario.sucursal=:sucursalId",{sucursalId:suc})
    .leftJoinAndSelect("producto.categoria","categoria")
    .leftJoinAndSelect("producto.marca","marca")
    .getMany()
    return resultado

  }
  async findProductImages(id:number){
    return await this.repository.findOne(id, {relations: ['fotos']});      
  }

  async productImage(idProduc: number, foto:FotoDto, res:any){  
        const {id, nombre} = foto;       
        const productos = await this.findProductImages(idProduc);
        var index:number = productos.fotos.indexOf(productos.fotos.find(a =>a.id === id && a.nombre == nombre));
        if(index === -1) throw new NotFoundException(`La foto no existe/pertenece al producto`);          
        return (res.sendFile(join(process.cwd(), 'uploads/productImages/' + nombre)));        
    }
    
    async findNameAutoProducto(nombre:string){
      console.log(nombre);
      
      return await this.repository.find({
         where: {
          nombre: ILike(`%${nombre}%`),
          estado: true
        } 
      });
    }
    
    async find(){
        const data = await this.repository
        .createQueryBuilder("producto")
        .andWhere("producto.estado = true")
        .getMany()
        return data
    }
}
