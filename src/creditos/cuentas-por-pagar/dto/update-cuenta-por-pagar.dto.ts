import { PartialType } from '@nestjs/swagger';
import { CreateCuentaPorPagarDto } from './create-cuenta-por-pagar.dto';

export class UpdateCuentaPorPagarDto extends PartialType(CreateCuentaPorPagarDto) {}
