import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataService } from 'src/common/service/common.service';
import { Alumno, AlumnoEdit } from './entity/alumno.entity';

@Injectable()
export class AlumnoService extends DataService(Alumno) {

    async save(alumno:Alumno){
        const email = await this.repository.findOne({email: alumno.email});
        if(email) throw new BadRequestException('El email ya existe');
        const alumnoDb = this.repository.create(alumno);
        return await this.repository.save(alumnoDb);
    }

    async editOne(id: number, alumno : AlumnoEdit){
        const alumoDb = await this.findById(id);
        const Edited = Object.assign(alumoDb, alumno);
        return await this.repository.save(Edited);
    }

}

