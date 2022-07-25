import { Injectable, CanActivate, ExecutionContext, NotAcceptableException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { CajaService } from '../caja.service';

@Injectable()
export class CajaGuard implements CanActivate {

    constructor(private readonly cajaService:CajaService, private readonly authService:AuthService){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.validateRequest(context);
  }

  async validateRequest(execContext: ExecutionContext): Promise<boolean>{
        const request = execContext.switchToHttp().getRequest();
        const bearToken = request.headers.authorization
        const jwt =  bearToken.replace('Bearer ', '');     
        const user = await this.authService.decodeToken(jwt);
        const caja = await this.cajaService.findOne(user.empleado.id)
        if(!caja || !caja.status)throw new BadRequestException('La caja no esta habilitada!')              
        return true;
  }
}