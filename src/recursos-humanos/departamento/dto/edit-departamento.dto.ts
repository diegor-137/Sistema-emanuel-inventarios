import { PartialType } from '@nestjs/mapped-types';
import { CreateDepartamentoDto } from './create-departamento.dto';


export class EditDepartamentoDto extends PartialType(
    CreateDepartamentoDto)
    {

    }