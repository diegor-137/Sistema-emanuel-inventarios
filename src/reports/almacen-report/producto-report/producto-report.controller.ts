import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductoReportService } from './producto-report.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User as UserEntity } from 'src/user/entities/user.entity';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('producto-report')
export class ProductoReportController {
  constructor(private readonly productoReportService: ProductoReportService) {}

  @Auth()
  @Get('listGeneral')
  ListadoGeneral(@User()user:UserEntity){
    return this.productoReportService.findAll(user)
  }

  @Auth()
  @Get('listGeneralEliminados')
  ListadoGeneralEliminados(@User()user:UserEntity){
    return this.productoReportService.findProductosEliminados(user)
  }

  @Auth()
  @Get('listPrecios')
  listadoPrecios(@User()user:UserEntity){
    return this.productoReportService.findListadoPrecios(user)
  }
}
