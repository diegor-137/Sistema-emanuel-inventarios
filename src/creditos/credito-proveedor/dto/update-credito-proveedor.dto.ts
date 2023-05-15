import { PartialType } from '@nestjs/swagger';
import { CreateCreditoProveedorDto } from './create-credito-proveedor.dto';

export class UpdateCreditoProveedorDto extends PartialType(CreateCreditoProveedorDto) {}
