import { Body, Controller, Param, Post, Put, Get, ParseIntPipe, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { User } from 'src/auth/decorators/user.decorator';
import { CommonController } from '../../common/controller/common.controller';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { EditClienteDto } from './dto/edit-cliente.dto';

@ApiTags('Cliente endPoints')
@Controller('cliente')
export class ClienteController{
    constructor(private readonly clienteService:ClienteService){}

    @Auth()
    @Get()
    async findAll(){
        return await this.clienteService.findAll()
    }

    @Auth()
    @Get('uno/:id')
    async findById(@Param('id',ParseIntPipe) id:number){
        return await this.clienteService.findById(id)
    }

    @Auth()
    @Post()
    async create(@Body() dto:CreateClienteDto, @User() user: UserEntity){                   
        return await this.clienteService.CreateOne(dto, user.empleado);
    }

    @Auth()
    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id:number, 
        @Body() dto:EditClienteDto,
        @User() user: UserEntity){
        return await this.clienteService.EditOne(id, dto, user.empleado)
    }

    @Auth()
    @Get()
    async all(@User() user: UserEntity){     
      return  await this.clienteService.findTodos(user.empleado.sucursal.id)      
    }

    @Get(':nombre?')
    async findNameAuto(@Param('nombre') nombre:string){
      return await this.clienteService.findByName(nombre)
    }

    @Auth()
    @Delete(':id')
    async deleteById(@Param('id',ParseIntPipe) id:number){
        return await this.clienteService.deleteById(id)
    }

    @Auth()
    @Get(':nombre?')
    async findByName(
      @Param('nombre') nombre:string
    ){
      return await this.clienteService.findByName(nombre)
    }
}
