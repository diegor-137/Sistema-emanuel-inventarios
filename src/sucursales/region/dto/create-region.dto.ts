import { IsBoolean, IsString } from "class-validator";

export class CreateRegionDto {
    @IsString()
    nombre:string

    @IsBoolean()
    estado:boolean
}