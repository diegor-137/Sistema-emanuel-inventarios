import { IsString } from "class-validator";

export class CreatetipoTransaccionDto {

    @IsString()
    nombre:string

}
