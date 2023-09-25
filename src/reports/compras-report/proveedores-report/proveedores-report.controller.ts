import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProveedoresReportService } from './proveedores-report.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity } from 'src/user/entities/user.entity';

@Controller('proveedores-report')
export class ProveedoresReportController {
  constructor(private readonly proveedoresReportService: ProveedoresReportService) {}

  @Auth()
  @Get('listGeneral')
  ListadoGeneral(@User()user:UserEntity){
    return this.proveedoresReportService.findAll(user)
  }

  @Auth()
  @Post('creditosActivos')
  CreditosActivos(@Body() dto:any, @User()user:UserEntity){
   //return console.log(user)
    return this.proveedoresReportService.creditosActivos(user)
  }
  

}
