import { PartialType } from '@nestjs/swagger';
import { CreateCompraReportDto } from './create-compra-report.dto';

export class UpdateCompraReportDto extends PartialType(CreateCompraReportDto) {}
