import { IsString } from "class-validator";


export class CreateCajaDto {
    
    @IsString()
    lugar:string

}
