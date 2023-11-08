import { PartialType } from '@nestjs/swagger';
import { CreatetipoTransaccionDto } from './create-tipo-transaccion.dto';

export class UpdateTipoTransaccionDto extends PartialType(CreatetipoTransaccionDto) {}
