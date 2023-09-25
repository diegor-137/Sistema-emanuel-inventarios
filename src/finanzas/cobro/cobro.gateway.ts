import { UseGuards } from '@nestjs/common';
import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { CobroService } from './cobro.service';


@WebSocketGateway(91, {
  cors: { origin: '*' }
})
export class CobroGateway implements OnGatewayConnection {

  @WebSocketServer()
  server: Server;

  constructor(private readonly cobroService: CobroService,
              private readonly authService:AuthService) {
  }
  handleConnection(socket:Socket) {
           
  }


  @SubscribeMessage('getFacturas')
  async handleMessage(socket:Socket, @MessageBody() usertoken: any) {  
    console.log(usertoken);
    const {token, idVenta, status} = usertoken  
    idVenta?await this.cobroService.updateVenta(idVenta, status):null; 
    const user = await this.authService.decodeToken(token);           
    const ventas = await this.cobroService.findVentaToday(user);
    this.server.emit(user.empleado.sucursal.nombre, ventas);
  }
}
