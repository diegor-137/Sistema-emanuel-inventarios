import { PartialType } from '@nestjs/swagger';
import { CreateCorteCajaDto } from './create-corte-caja.dto';

export class UpdateCorteCajaDto extends PartialType(CreateCorteCajaDto) {}
