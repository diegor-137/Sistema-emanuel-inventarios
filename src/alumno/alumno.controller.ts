import { Body, Controller, Post,  Param, ParseIntPipe, Put} from '@nestjs/common';
import { AlumnoService } from './alumno.service';
import { Alumno, AlumnoEdit } from './entity/alumno.entity';
import { CommonController } from '../common/controller/common.controller';

@Controller('alumno')
export class AlumnoController extends CommonController(AlumnoService){

    constructor (private readonly alumnoService : AlumnoService){super()}
    @Post()    
    async save(@Body() alumno: Alumno){
        return await this.alumnoService.save(alumno);
    }

    @Put(':id')
    async editOne(@Param('id', ParseIntPipe) id:number, @Body() alumno:AlumnoEdit){
        return await this.alumnoService.editOne(id, alumno)    
    }


}
