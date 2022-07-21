import { PartialType } from '@nestjs/swagger';
import { CreateEgresoDto } from './create-egreso.dto';

export class UpdateEgresoDto extends PartialType(CreateEgresoDto) {}
