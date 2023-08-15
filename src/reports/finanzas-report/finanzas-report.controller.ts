import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FinanzasReportService } from './finanzas-report.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { User } from 'src/auth/decorators/user.decorator';
import { finanzasReport } from '../dto/finanzas-report.dto';


@Controller('finanzas-report')
export class FinanzasReportController {
  constructor(private readonly finanzasReportService: FinanzasReportService) {}

  @Auth()
  @Post('utilidad-detallada')
  utilidadDetallada(@Body() dto:finanzasReport, @Query() query: { start: Date, end:Date}, @User()user: UserEntity) {     
    return this.finanzasReportService.utilidadDetallada(query.start,query.end, user, dto);
  }

}
