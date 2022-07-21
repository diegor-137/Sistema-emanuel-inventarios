import { Controller } from '@nestjs/common';
import { EgresosService } from './egresos.service';

@Controller('egresos')
export class EgresosController {
  constructor(private readonly egresosService: EgresosService) {}
}
