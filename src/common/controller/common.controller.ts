import { Inject, Type, Get, Delete, ParseIntPipe, Param } from '@nestjs/common';
import { IDataService } from '../service/common.service';

type Constructor<I> = new (...args: any[]) => I // Main Point
  
  export function CommonController<T>(service: Constructor<T>): Type<IDataService<T>> {

    class DataControllerHost implements IDataService<T> {            
    @Inject(service) 
    readonly repository : any;


    @Get()
    async findAll(){
        return await this.repository.findAll();
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id:number){
        return await this.repository.findById(id);
    }

    @Delete(':id')
    async deleteById(@Param('id', ParseIntPipe) id:number){
        const data = await this.repository.deleteById(id);
        return { status : 'Eliminado', data}
    }


    }
    return DataControllerHost;
  }

