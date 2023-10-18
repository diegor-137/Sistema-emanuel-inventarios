import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { VentasReportService } from './ventas-report.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';

@Controller('ventas-report')
export class VentasReportController {
  constructor(private readonly ventasReportService: VentasReportService) {}
  
  @Auth()
  @Post()
  async findAll(@Query() query: { start: Date, end:Date},
                    @User() user:UserEntity,
                    @Body() dto:any) {
    return await this.ventasReportService.find(query.start,query.end,user,dto);
  }
}
