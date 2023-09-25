import { Controller, Get, Post, Body } from '@nestjs/common';
import { ClientesReportService } from './clientes-report.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity } from 'src/user/entities/user.entity';

@Controller('clientes-report')
export class ClientesReportController {
  constructor(private readonly clientesReportService: ClientesReportService) {}

  @Auth()
  @Get('listadoGeneral')
  ListadoGeneral(@User()user:UserEntity){
    return this.clientesReportService.findAllClientes(user)
  }

  @Auth()
  @Get('creditosClientes')
  CreditoClientes(@User()user:UserEntity){
    return this.clientesReportService.creditosClientes(user)
  }
}
