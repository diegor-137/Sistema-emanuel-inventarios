import { IsArray, IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { Role } from "src/app.roles";
import { EnumToString } from "src/helpers/enumToString";
import { Empleado } from "src/recursos-humanos/empleado/entity/empleado.entity";



export class CreateUserDto {

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
