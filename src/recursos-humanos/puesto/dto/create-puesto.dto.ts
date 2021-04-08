import { IsString, IsBoolean, IsNumber, IsArray, IsInstance, IsOptional } from 'class-validator';
import { Departamento } from '../../departamento/entity/departamento.entity';

export class CreatePuestoDto{
  @IsString()
  nombre:string
  
  @IsBoolean()
  estado:boolean

  @IsOptional()
  departamento:Departamento
}