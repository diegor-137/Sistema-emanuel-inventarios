import { IsString } from "class-validator";

export class CreateBancoDto {

    @IsString()
    nombre:string
}
