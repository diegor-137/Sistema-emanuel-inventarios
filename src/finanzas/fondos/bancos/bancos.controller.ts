import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BancosService } from './bancos.service';
import { CreateBancoDto } from './dto/create-banco.dto';
import { UpdateBancoDto } from './dto/update-banco.dto';

@Controller('bancos')
export class BancosController {
  constructor(private readonly bancosService: BancosService) {}

  @Post()
  async create(@Body() createBancoDto: CreateBancoDto) {
    return await this.bancosService.create(createBancoDto);
  }

  @Get()
  async findAllBancos() {
    return await this.bancosService.findAll();
  }
}
