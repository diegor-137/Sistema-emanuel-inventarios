import { PartialType } from '@nestjs/swagger';
import { CreateTipoGastoDto } from './create-tipo-gasto.dto';

export class UpdateTipoGastoDto extends PartialType(CreateTipoGastoDto) {}
