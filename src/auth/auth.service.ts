import { Injectable } from '@nestjs/common';
import { EmpleadoService } from 'src/recursos-humanos/empleado/empleado.service';
import { compare } from 'bcryptjs';
import { Empleado } from 'src/recursos-humanos/empleado/entity/empleado.entity';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        //private readonly empleadosService: EmpleadoService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
      ) {}
    
      /* async validateEmpleado(email: string, pass: string): Promise<any> {
        const empleado = await this.empleadosService.findOne({ email });    
        if (empleado && (await compare(pass, empleado.password))) {
          const { password, ...rest } = empleado;
          return rest;
        }
        return null;
      }
    
      login(empleado: Empleado) {
        const { id, ...rest } = empleado;
        const payload = { sub: id };    
        return {
          empleado,
          accessToken: this.jwtService.sign(payload),
        };
      }
 */
      async validateEmpleado(user: string, pass: string): Promise<any> {
        const userData = await this.userService.findOne({ user });    
        if (userData && (await compare(pass, userData.password))) {
          const { password, ...rest } = userData;
          return rest;
        }
        return null;
      }
    
      async login(user: User) {
        const { id, ...rest } = user;
        const payload = { sub: id };    
        return {
          user,
          accessToken: await this.jwtService.signAsync(payload),
        };
      }

}
