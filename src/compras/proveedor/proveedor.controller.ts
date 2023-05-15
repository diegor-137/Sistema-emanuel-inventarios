<<<<<<< HEAD
import { Body, Controller, Post, Put, ParseIntPipe, Param, Get } from '@nestjs/common';
=======
import { Body, Controller, Post, Put, ParseIntPipe, Param, Get, Delete } from '@nestjs/common';
>>>>>>> 34de35d63b5379a90ec65886837da6d76c32b55f
import { CommonController } from '../../common/controller/common.controller';
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { EditProveedorDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
<<<<<<< HEAD
import { User as UserEntity} from 'src/user/entities/user.entity';
import { User } from 'src/auth/decorators/user.decorator';
=======
>>>>>>> 34de35d63b5379a90ec65886837da6d76c32b55f

@ApiTags('Proveedor endPoints')
@Controller('proveedor')
export class ProveedorController{

    constructor(private readonly proveedorService:ProveedorService){
    }

    @Auth()
<<<<<<< HEAD
=======
    @Get()
    async findAll(){
        return await this.proveedorService.findAll()
    }

    @Auth()
    @Get('uno/:id')
    async findById(@Param('id',ParseIntPipe) id:number){
        return await this.proveedorService.findById(id)
    }

    @Auth()
>>>>>>> 34de35d63b5379a90ec65886837da6d76c32b55f
    @Post()
    async CreateOne(
        @Body() dto:CreateProveedorDto, @User() user: UserEntity
    ){
        return await this.proveedorService.createOne(dto, user.empleado)
    }

    @Auth()
    @Put(':id')
    async editOne(
        @Param('id',ParseIntPipe) id:number,
        @Body() dto:EditProveedorDto, 
        @User() user: UserEntity
    ){
        return await this.proveedorService.editOne(id,dto, user.empleado)
    }

    @Auth()
<<<<<<< HEAD
    @Get()
    async all(@User() user: UserEntity){     
      return  await this.proveedorService.findTodos(user.empleado.sucursal.id)      
    }

    @Get(':nombre?')
    async findNameAuto(@Param('nombre') nombre:string){
      return await this.proveedorService.findByName(nombre)
    }

    
=======
    @Delete(':id')
    async deleteById(@Param('id',ParseIntPipe) id:number){
        return await this.proveedorService.deleteById(id)
    }

    @Auth()
    @Get(':nombre?')
    async findByName(
      @Param('nombre') nombre:string
    ){
      return await this.proveedorService.findByName(nombre)
    }
>>>>>>> 34de35d63b5379a90ec65886837da6d76c32b55f
}
