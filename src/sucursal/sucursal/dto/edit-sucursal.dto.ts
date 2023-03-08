import { PartialType } from "@nestjs/swagger";
import { CreateSucursalDto } from "./create-sucursal.dto";

export class EditSucursalDto extends PartialType(CreateSucursalDto){
    
}