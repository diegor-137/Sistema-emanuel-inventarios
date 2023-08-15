import { PartialType } from '@nestjs/swagger';
import { CreateRecepcionDto } from './create-recepcion.dto';

export class UpdateRecepcionDto extends PartialType(CreateRecepcionDto) {}
