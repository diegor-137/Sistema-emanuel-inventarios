import { IsBoolean, IsString } from "class-validator";
import { FileAws3 } from "src/files/entities/file.entity";

export class CreateRegionDto {
    @IsString()
    nombre:string

    @IsBoolean()
    estado:boolean

}