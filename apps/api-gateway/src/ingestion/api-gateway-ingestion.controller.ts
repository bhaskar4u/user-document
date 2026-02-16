import { Controller, Post, Body, Inject, UseGuards, Request, Get, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('ingestion')
export class ApiGatewayIngestionController {
  constructor(@Inject('INGESTION_SERVICE') private readonly ingestionService: ClientProxy) {}

  @Post('start')
  @UseGuards(JwtAuthGuard)
  async startIngestion(@Body() data: { documentId: number }, @Request() req) {
    const ingestionData = { userId: req.user.id, documentId: data.documentId };
    return this.ingestionService.send('ingestion.start', ingestionData);
  }

  @Get('status/:documentId')
  @UseGuards(JwtAuthGuard)
  async getIngestionStatus(@Param('documentId') documentId: number) {    
    return this.ingestionService.send('ingestion.status', { documentId:Number(documentId) } );
  }
}
 


