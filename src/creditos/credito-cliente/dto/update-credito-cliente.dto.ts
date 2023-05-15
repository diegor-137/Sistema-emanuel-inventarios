import { PartialType } from '@nestjs/swagger';
import { CreateCreditoClienteDto } from './create-credito-cliente.dto';

export class UpdateCreditoDto extends PartialType(CreateCreditoClienteDto) {}
