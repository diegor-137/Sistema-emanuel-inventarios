import { PartialType } from '@nestjs/mapped-types';
import { CreateCotizacionDto } from './create-cotizacion.dto';

export class EditCotizacionDto extends PartialType(CreateCotizacionDto){}