import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreditoClienteService } from './credito-cliente.service';
import { CreateCreditoClienteDto } from './dto/create-credito-cliente.dto';
import { UpdateCreditoDto } from './dto/update-credito-cliente.dto';

@Controller('credito')
export class CreditoClienteController {
  constructor(private readonly creditoClienteService: CreditoClienteService) {}

/*   @Post()
  create(@Body() createCreditoDto: CreateCreditoDto) {
    return this.creditoService.create(createCreditoDto);
  } */

}
