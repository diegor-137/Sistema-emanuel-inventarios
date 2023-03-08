import { IsBoolean, IsOptional, IsString } from "class-validator";
export class CreateSucursalDto {
    @IsString()
    nombre:string

    @IsBoolean()
    estado:boolean
}
