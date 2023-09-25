import { IsNotEmpty } from "class-validator";

export class CreateTipoGastoDto {

    @IsNotEmpty()
    nombre:string
}
