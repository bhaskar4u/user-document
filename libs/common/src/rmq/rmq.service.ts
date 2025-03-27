import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  private readonly rmqUri: string;

  constructor(private readonly configService: ConfigService) {
    this.rmqUri = this.configService.get<string>('RABBIT_MQ_URI', `amqp://${configService.get<string>('RABBITMQ_DEFAULT_USER')}:${configService.get<string>('RABBITMQ_DEFAULT_PASS')}@${configService.get<string>('RABBITMQ_HOST')}:${configService.get<number>('RABBITMQ_PORT')}`);
  }

  getOptions(queue: string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.rmqUri],
        queue: this.configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`, `${queue}s`),
        noAck,
        queueOptions: {
          durable: true, // Ensures messages persist in RabbitMQ
        },
      },
    };
  }

  ack(context: RmqContext): void {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    if (channel && originalMessage) {
      channel.ack(originalMessage);
    }
  }
}
