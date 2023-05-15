import { IsArray, IsEnum, IsNumber, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Role } from "src/app.roles";
import { EnumToString } from "src/helpers/enumToString";
import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity";
import { Sucursal } from '../../sucursal/entity/sucursal.entity';



export class CreateUserDto {

    @IsOptional()
    id:number

    @IsString()
    user:string

    @IsString()
    @MinLength(8)
    @MaxLength(128)
    password: string


    @IsArray()
    @IsEnum(Role, {
    each: true,
    message: `must be a valid role value, ${EnumToString(Role)}`,
    })
    roles: string[];

    @IsOptional()
    empleado:Empleado
   
}
