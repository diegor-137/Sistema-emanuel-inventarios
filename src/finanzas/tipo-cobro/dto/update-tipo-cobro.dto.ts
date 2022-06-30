import { PartialType } from '@nestjs/swagger';
import { CreateTipoCobroDto } from './create-tipo-cobro.dto';

export class UpdateTipoCobroDto extends PartialType(CreateTipoCobroDto) {}
