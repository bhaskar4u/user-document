import { MessagePattern, Payload } from '@nestjs/microservices';
import { Documents } from './documents.entity'
import { Controller,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {DocumentsService} from './documents.service'
import { Repository } from 'typeorm'
@Controller()
export class DocumentController {
   constructor(
    private readonly documentService: DocumentsService) {}

  @MessagePattern('document.upload')
  async uploadDocument(
    @Payload() payload: { userId: number; filename: string; path: string },
  ) {
    return this.documentService.uploadDocument(payload);
  }


}
