import { PartialType } from '@nestjs/mapped-types';
import { CreateCompraDto } from './create-compra.dto';


export class EditCompraDto extends PartialType(CreateCompraDto){
    
}