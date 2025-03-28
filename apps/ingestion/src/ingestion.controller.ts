import { IngestionService } from './ingestion.service';
import { Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';


@Controller('ingestion')
export class IngestionController {
  constructor(@Inject('INGESTION_SERVICE') private readonly ingestionService: IngestionService) {}

  @MessagePattern('ingestion.start')
  async startIngestions(@Payload() data: { documentId: any; userId: number }): Promise<{ message: string; documentId: any; status: string }> {
    const { documentId, userId } = data;
    return this.ingestionService.startIngestion(documentId, userId);
  }
  

  @MessagePattern('ingestion.status')
  async getIngestionStatus(@Payload('documentId') documentId: string) {    
    return this.ingestionService.getStatus(documentId );
  }
}
