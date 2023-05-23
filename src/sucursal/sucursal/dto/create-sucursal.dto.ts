import { IsBoolean, IsOptional, IsString } from "class-validator";
import { FileAws3 } from "src/files/entities/file.entity";
export class CreateSucursalDto {
    @IsString()
    nombre:string

    @IsBoolean()
    @IsOptional()
    estado:boolean

    foto:FileAws3
}
