import { IsBoolean, IsString } from "class-validator";

export class CreateSucursalDto {
    @IsString()
    nombre:string

    @IsBoolean()
    estado:boolean
}