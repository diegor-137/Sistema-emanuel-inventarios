import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { FileAws3 } from "src/files/entities/file.entity";
import { Region } from "src/sucursales/region/entity/region.entity"
export class CreateSucursalDto {
    @IsString()
    nombre:string

    @IsBoolean()
    @IsOptional()
    estado:boolean

    @IsNotEmpty()
    region:Region

    foto:FileAws3
}
