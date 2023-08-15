import { Controller, Post, Body, Put, Param, ParseIntPipe, Get, UseGuards, SetMetadata, Delete } from '@nestjs/common';
import { CommonController } from '../../common/controller/common.controller';
import { CreateEmpleadoDto } from './dto';
import { EmpleadoService } from './services/empleado.service';
import { EditDepartamentoDto } from '../departamento/dto/edit-departamento.dto';
import { EditEmpleadoDto } from './dto/edit-empleado.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { Recurso } from 'src/app.roles';
import { ApiTags } from '@nestjs/swagger';
import { PermissionsRequired } from 'src/auth/decorators/permissions.decorator';
import Permission from 'src/auth/enums/permission.type';
import { CreateHistorialEmpDto } from './dto/create-historial.dto';
import { HistorialEmpService } from './services/historial-emp.service';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';

@ApiTags('Empleados endPoints')
@Controller('empleado')
export class EmpleadoController{
    constructor(private readonly empleadoService:EmpleadoService,
                private readonly historialEmp:HistorialEmpService)
    {}

    @Auth()
    @Get()
    async findAll(){
        return await this.empleadoService.findAll()
    }

    @Auth()
    @Get(':id')
    async findById(@Param('id',ParseIntPipe) id:number){
        return await this.empleadoService.findById(id)
    }

    @Auth()
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

    //esta funcion se usa para desactivar usuario
    @Auth()
    @Put('desactivar/:id')
    async Desactivar(@Param('id',ParseIntPipe) id:number,
                     @Body() dto:CreateHistorialEmpDto,
                     @User() user: UserEntity){
        dto.usuario = user.empleado.nombre
        //return console.log(dto)
        return await this.empleadoService.desacrivar(id,dto)
    }

    //esta funcion se usa para activar usuario 
    @Auth()
    @Put('activar/:id')
    async Activar(@Param('id',ParseIntPipe) id:number,
                     @Body() dto:CreateHistorialEmpDto,
                     @User() user: UserEntity){
        dto.usuario = user.empleado.nombre
        return await this.empleadoService.activar(id,dto)
    }


    /************Historial Empleado************/

    @Auth()
    @Get('historial/:id')
    async FindByEmpleado(
        @Param('id',ParseIntPipe) id:number,
    ){
        return await this.historialEmp.findByIdEmpleado(id)
    }

    @Auth()
    @Post('historial')
    async CreateHistorial(
        @Body() dto:CreateHistorialEmpDto
    ){
        return await this.historialEmp.createOne(dto)
    }
}
