import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'user', // 'username'
      passwordField: 'password', // 'passport'
    });
  }

  async validate(user: string, password: string) {
    const usuario = await this.authService.validateEmpleado(user, password);       
    if (!usuario)
      throw new UnauthorizedException('El usuario o la contraseña no coinciden.');
    return usuario;
  }
}