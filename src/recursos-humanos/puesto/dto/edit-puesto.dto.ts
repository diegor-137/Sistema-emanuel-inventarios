import { PartialType } from '@nestjs/mapped-types';
import { CreatePuestoDto } from './create-puesto.dto';

export class EditPuestoDto extends PartialType(
    CreatePuestoDto){

}