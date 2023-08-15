import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Recurso } from 'src/app.roles';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CommonController } from 'src/common/controller/common.controller';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { EditSucursalDto } from './dto/edit-sucursal.dto';
import { SucursalService } from './sucursal.service';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';


@ApiTags('Sucursal endPoints')
@Controller('sucursal')
export class SucursalController extends CommonController(SucursalService){
    constructor(private readonly sucursalService:SucursalService){super()}

    @Auth({action: 'create',possession: 'any',resource: Recurso.SUCURSAL})
    @Post()
    @UseInterceptors(FileInterceptor('fotoSend'))
    async CreateOne(
        @Body() dto:CreateSucursalDto,
        @UploadedFile() fotoSend: Express.Multer.File)
        {
            return await this.sucursalService.CreateOne(dto, fotoSend)
        }

    @Put(':id')
    async editOne(
        @Param('id',ParseIntPipe) id:number,
        @Body() dto:EditSucursalDto)
        {
            return await this.sucursalService.editOne(id,dto)
        }

    @Get('region')
    async findRegion(){
        return await this.sucursalService.findAllSucursal()
    }
    @Get('todos')    
    async findTodos(){
        return await this.sucursalService.findTodos();
    }  
    
    @Auth()
    @Get("name/:nombre")
    async sucursalName(@Param("nombre") nombre: string) {
        return await this.sucursalService.sucursalName(nombre);
    }

    @Auth()
    @Get("por-region")
    async sucursalesPorRegion( @User() user: UserEntity) {
        return await this.sucursalService.sucursalesPorRegion(user);
    }
}
