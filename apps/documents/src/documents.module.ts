import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Documents } from './documents.entity';
import {RmqService} from '@app/common'
import {DocumentController} from './documents.controller'
import {DocumentsService} from './documents.service'



@Module({
  controllers:[DocumentController],
  imports: [DatabaseModule, TypeOrmModule.forFeature([Documents])],
  providers: [DocumentsService,RmqService],
  exports: [TypeOrmModule],
})
export class DocumentsModule {}