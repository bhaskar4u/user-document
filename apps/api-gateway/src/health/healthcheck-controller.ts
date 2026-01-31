import { Controller, Post, Get,Body, Inject, UseGuards, Request } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('health')
export class HealthcheckController {
    @Get('check')
      health() {
    return { status: 'ok' };
  }
    
}
