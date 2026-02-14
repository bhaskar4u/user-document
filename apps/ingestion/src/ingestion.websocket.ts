import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class IngestionWebsocket  {
  @WebSocketServer()
  server: Server;

  sendUpdate(documentId: number, status: string) {
    this.server.emit(`ingestion_status_${documentId}`, { documentId, status });
  }
}
