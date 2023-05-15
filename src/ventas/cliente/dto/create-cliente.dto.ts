import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";
import { CreateCreditoClienteDto } from "src/creditos/credito-cliente/dto/create-credito-cliente.dto";

export class CreateClienteDto{
    @IsString()
    nombre:string

    @IsOptional()
    @IsString()
    direccion:string

    @IsOptional()
    @IsString()
    telefono:string

    @IsOptional()
    @IsString()
    nit:string

    @IsBoolean()
    estado:boolean

    @IsBoolean()
    credit:boolean

    @IsOptional()
    @IsArray()
    credito:CreateCreditoClienteDto[]
}