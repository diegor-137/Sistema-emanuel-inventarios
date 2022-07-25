import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { CajaService } from './caja.service';
import { CreateCajaDto } from './dto/create-caja.dto';
import { User as UserEntity} from 'src/user/entities/user.entity';


@Controller('caja')
export class CajaController {
  constructor(private readonly cajaService: CajaService) {}
  
  @Auth()
  @Post()
  async create(@Body() createCajaDto: CreateCajaDto, @User() user: UserEntity) {
    return await this.cajaService.create(createCajaDto, user);
  }

  @Auth()
  @Get()
  async findAll(@User() user: UserEntity) {
    return await this.cajaService.findAll(user);
  }

  @Auth()
  @Get('cajeros')
  async cajeros(@User() user: UserEntity) {
    return await this.cajaService.cajeros(user);
  }

  @Auth()
  @Delete(':id')
  async update(@Param('id') id: number, @User() user: UserEntity) {
    return await this.cajaService.update(+id, user);
  }

  @Auth()
  @Get(':id')
  async getOne(@Param('id') id: number){
    return await this.cajaService.findOne(+id);
  }
}
