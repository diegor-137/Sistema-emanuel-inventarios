import { NotFoundException, Type } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { EntitySchema, Repository, Entity, ILike } from 'typeorm';


export interface IDataService<T> {
    readonly repository: Repository<T>
    findAll:()=> Promise<T[]>
    findById:(id:number,msg?: string)=> Promise<T>
    deleteById:(id:number)=> Promise<any>
    findByNameR:(nombre:string, relacion:string)=> Promise<any>
    findByName:(nombre:string)=> Promise<any>
  }
  
  type Constructor<I> = new (...args: any[]) => I // Main Point
  
  export function DataService<T>(entity: Constructor<T>): Type<IDataService<T>> {
    
    class DataServiceHost implements IDataService<T> {
      @InjectRepository(entity) readonly repository: Repository<T>

    async findAll(){
        return await this.repository.find();
    }
    async findById(id:number){
        const data = await this.repository.findOne(id);
        if(!data) throw new NotFoundException(`El registro no fue encontrado`);
        return data;
    }
    async deleteById(id:number){
        const data = await this.findById(id)
        return await this.repository.remove(data);
    }

    async findByNameR(nombre:string, relacion:string){
      return await this.repository.find({
        relations:[`${relacion}`],
         where: {
          nombre: ILike(`%${nombre}%`),
          estado: true
        } 
      });
    }

    async findByName(nombre:string){
      return await this.repository.find({
         where: {
          nombre: ILike(`%${nombre}%`),
          estado: true
        } 
      });
    }
      
    }
    return DataServiceHost;
  }

  
