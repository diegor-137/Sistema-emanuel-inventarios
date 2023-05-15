import { PartialType } from '@nestjs/swagger';
import { CreateCuentasPorCobrarDto } from './create-cuentas-por-cobrar.dto';

export class UpdateCuentasPorCobrarDto extends PartialType(CreateCuentasPorCobrarDto) {}
