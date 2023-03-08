import { PartialType } from "@nestjs/swagger";
import { CreateSucursalDto } from "src/sucursal/sucursal/dto/create-sucursal.dto";

export class EditRegionDto extends PartialType(CreateSucursalDto){
    
}