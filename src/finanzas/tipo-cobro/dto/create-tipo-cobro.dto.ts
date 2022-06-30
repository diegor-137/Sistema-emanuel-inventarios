import { IsString } from "class-validator";

export class CreateTipoCobroDto {

    @IsString()
    nombre:string

}
