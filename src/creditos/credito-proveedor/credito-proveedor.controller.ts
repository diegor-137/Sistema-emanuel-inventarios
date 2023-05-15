import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreditoProveedorService } from './credito-proveedor.service';
import { CreateCreditoProveedorDto } from './dto/create-credito-proveedor.dto';
import { UpdateCreditoProveedorDto } from './dto/update-credito-proveedor.dto';

@Controller('credito-proveedor')
export class CreditoProveedorController {
  constructor(private readonly creditoProveedorService: CreditoProveedorService) {}
}
