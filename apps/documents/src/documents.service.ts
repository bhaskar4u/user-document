import { Injectable, OnModuleInit,Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documents } from './documents.entity';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import {RmqService} from '@app/common'

@Injectable()
export class DocumentsService implements OnModuleInit {
  constructor(
    @InjectRepository(Documents) private readonly documentRepo: Repository<Documents>,
  ) {}
 async onModuleInit() {
  console.log('DocumentsService initialized!');
  }

  @MessagePattern('user.created')
  handleUserCreated(data: { userId: number }) {
    console.log(`User created with ID: ${data.userId}`);
  }
  @MessagePattern('document.uploaded')
  async uploadDocument(userId: number, filename: string, path: string) {
    const doc = this.documentRepo.create({ ownerId: userId, filename, path });
    await this.documentRepo.save(doc);
    return doc;
  }
}
