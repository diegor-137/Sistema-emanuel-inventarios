import { PartialType } from '@nestjs/swagger';
import { CreateEfectivoDto } from './create-efectivo.dto';

export class UpdateEfectivoDto extends PartialType(CreateEfectivoDto) {}
