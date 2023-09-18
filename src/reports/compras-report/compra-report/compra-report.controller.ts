import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompraReportService } from './compra-report.service';
import { CreateCompraReportDto } from './dto/create-compra-report.dto';
import { UpdateCompraReportDto } from './dto/update-compra-report.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('compra-report')
export class CompraReportController {
  constructor(private readonly compraReportService: CompraReportService) {}

  @Auth()
  @Get()
  async create(@Query() query: { start: Date, end:Date},
                    @User() user:UserEntity) {
    return await this.compraReportService.find(query.start,query.end,user);
  }

  @Auth()
  @Get('anuladas')
  async createAnulados(@Query() query: { start: Date, end:Date},
                    @User() user:UserEntity) {
    return await this.compraReportService.findComprasCanceladas(query.start,query.end,user);
  }
}
