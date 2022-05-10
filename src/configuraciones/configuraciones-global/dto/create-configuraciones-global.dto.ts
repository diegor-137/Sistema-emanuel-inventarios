import { IsBoolean, IsString } from "class-validator";

export class CreateConfiguracionesGlobalDto {

    @IsString()
    name:string

    @IsBoolean()
    checked:boolean
}
