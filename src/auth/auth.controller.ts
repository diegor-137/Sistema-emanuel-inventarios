import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth endPoints')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
  /* EL DTO NOS PERMITE VER EN SWAGGER LOS PARAMETROS DE LA PETICION */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @User() user: UserEntity) {
    const data = await this.authService.login(user);
    return {
      message: 'Login exitoso',
      accessToken: data.accessToken,
      ok:true
    };
  }

  @Auth()
  @Get('profile')
  async profile(@User() user: UserEntity) {     
    const data = await this.authService.login(user);

    delete data.user.empleado.createdAt
    delete data.user.empleado.direccion
    delete data.user.empleado.email
    delete data.user.empleado.telefono

    return {
      message: 'Petición correcta',
      accessToken: data.accessToken,
      ok:true,
      id:data.user.id,
      user: data.user.user,
      role:data.user.roles,
      empleado:data.user.empleado,
    };
  }
}
