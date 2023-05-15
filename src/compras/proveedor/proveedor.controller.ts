import { Body, Controller, Post, Put, ParseIntPipe, Param, Get } from '@nestjs/common';
import { CommonController } from '../../common/controller/common.controller';
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { EditProveedorDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { User } from 'src/auth/decorators/user.decorator';

@ApiTags('Proveedor endPoints')
@Controller('proveedor')
export class ProveedorController extends CommonController (ProveedorService) {

    constructor(private readonly proveedorService:ProveedorService){
        super()
    }

    @Auth()
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
    @Get()
    async all(@User() user: UserEntity){     
      return  await this.proveedorService.findTodos(user.empleado.sucursal.id)      
    }

    @Get(':nombre?')
    async findNameAuto(@Param('nombre') nombre:string){
      return await this.proveedorService.findByName(nombre)
    }

    
}
