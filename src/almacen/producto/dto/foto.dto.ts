import { IsNotEmpty, IsNumber, IsString } from "class-validator";









export class FotoDto{

    @IsNumber()
    @IsNotEmpty()
    id:number

    @IsString()
    @IsNotEmpty()
    nombre:string

}