import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpleadoDto } from './create-empleado.dto';

export class EditEmpleadoDto extends PartialType(CreateEmpleadoDto){
    
}