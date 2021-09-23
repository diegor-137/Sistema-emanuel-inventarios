import {IsBoolean,isEmpty,isNotEmpty,IsString} from 'class-validator';

export class CreateDepartamentoDto{
    @IsString()
    nombre:string

    @IsBoolean()
    estado:boolean
}