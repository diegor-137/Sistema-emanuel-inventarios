import { Body, Controller, Get, Query, Post } from '@nestjs/common';
import { InventarioReportService } from './inventario-report.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity } from 'src/user/entities/user.entity';

@Controller('inventario-report')
export class InventarioReportController {
  constructor(private readonly inventarioReportService: InventarioReportService) {}

  @Auth()
  @Get('inventarioPorSucursal')
  InventarioPorSucursal(@User()user:UserEntity){
    //return console.log('hola')
    return this.inventarioReportService.findAll(user)
  }

  @Auth()
  @Get('inventarioPorRegion')
  InventarioPorRegion(@User()user:UserEntity){
    return this.inventarioReportService.findPorRegion(user)
  }

  @Auth()
  @Post('kardexPorRegion')
  kardexPorRegion(@Body() dto:any, @Query() query: { start: Date, end:Date}, @User()user: UserEntity){
    return this.inventarioReportService.kardexPorRegion(query.start,query.end, user, dto)
  }

  @Auth()
  @Post('kardexPorSucursal')
  kardexPorSucursal(@Body() dto:any, @Query() query: { start: Date, end:Date}, @User()user: UserEntity){
    return this.inventarioReportService.kardexPorSucursal(query.start,query.end, user, dto)
  }
}
