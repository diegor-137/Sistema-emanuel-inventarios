import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CobroService } from './cobro.service';


@WebSocketGateway(91, {
  cors: { origin: '*' }
})
export class CobroGateway {

  @WebSocketServer()
  server: Server;

  constructor(private readonly cobroService: CobroService) {
  }

  @SubscribeMessage('getFacturas')
  async handleMessage() {
    const ventas = await this.cobroService.findVentaToday();
    this.server.emit('ventas', ventas);
  }
}
