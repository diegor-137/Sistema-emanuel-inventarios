import { Controller, Post, Body, Put, Param, ParseIntPipe, Get, UseGuards, SetMetadata } from '@nestjs/common';
import { CommonController } from '../../common/controller/common.controller';
import { CreateEmpleadoDto } from './dto';
import { EmpleadoService } from './empleado.service';
import { EditDepartamentoDto } from '../departamento/dto/edit-departamento.dto';
import { EditEmpleadoDto } from './dto/edit-empleado.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Recurso } from 'src/app.roles';
import { ApiTags } from '@nestjs/swagger';
import { PermissionsRequired } from 'src/auth/decorators/permissions.decorator';
import Permission from 'src/auth/enums/permission.type';

@ApiTags('Empleados endPoints')
@Controller('empleado')
export class EmpleadoController extends CommonController (EmpleadoService) {

    constructor(private readonly empleadoService:EmpleadoService)
    {super()}

   /*  @Auth({
        action: 'create',
        possession: 'any',
        resource: Recurso.EMPLEADO
    }) */
    //@PermissionsRequired(Permission.CrearEmpleado)
    @Post()
    async CreateOne(
        @Body() dto:CreateEmpleadoDto
    ){
        return await this.empleadoService.createOne(dto)
    }

    @Put(':id')
    async EditOne(
        @Param('id',ParseIntPipe) id:number,
        @Body() dto:EditEmpleadoDto
    ){
        return await this.empleadoService.editOne(id,dto)
    }

    @Get("encontrar")
    async findAllEmpledo(){
        return await this.empleadoService.findMany_Empleado()
    }

    @Get("encontrar/:id")
    async findByIdEmpleado(
        @Param('id',ParseIntPipe) id:number
    ){
        return await this.empleadoService.findOne_Empelado(id)
    }

/*     @Get('nombre/:nombre?')
    async findByNombre(
        @Param('nombre') nombre:string
    ){
        return await this.empleadoService.findByNombre(nombre)
    } */
}
