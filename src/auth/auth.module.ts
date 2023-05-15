import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { EmpleadoModule } from 'src/recursos-humanos/empleado/empleado.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_SECRET } from '../config/constants';
import { LocalStrategy } from './estrategies/local.strategy';
import { JwtStrategy } from './estrategies/jtw.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[PassportModule.register({
    defaultStrategy: 'jwt',
  }),
  JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      secret: config.get<string>(JWT_SECRET),
      signOptions: { expiresIn: '10h' },
    }),
  }),
  EmpleadoModule, UserModule],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
