import { PartialType } from '@nestjs/swagger';
import { CreateConfiguracionesGlobalDto } from './create-configuraciones-global.dto';

export class UpdateConfiguracionesGlobalDto extends PartialType(CreateConfiguracionesGlobalDto) {}
