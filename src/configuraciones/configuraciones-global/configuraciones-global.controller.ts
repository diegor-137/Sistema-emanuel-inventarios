import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConfiguracionesGlobalService } from './configuraciones-global.service';
import { CreateConfiguracionesGlobalDto } from './dto/create-configuraciones-global.dto';
import { UpdateConfiguracionesGlobalDto } from './dto/update-configuraciones-global.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('configuraciones-global')
export class ConfiguracionesGlobalController {
  constructor(private readonly configuracionesGlobalService: ConfiguracionesGlobalService) {}

  @Auth()
  @Post()
  create(@Body() createConfiguracionesGlobalDto: CreateConfiguracionesGlobalDto, @User() user: UserEntity) {
    return this.configuracionesGlobalService.create(createConfiguracionesGlobalDto, user);
  }

  @Auth()
  @Get()
  async getConfiguraciones(@User() user: UserEntity) {
    return await this.configuracionesGlobalService.getConfiguraciones(user);
  }

}
