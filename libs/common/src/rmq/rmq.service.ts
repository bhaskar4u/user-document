import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RmqContext,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { Channel } from 'amqplib';

@Injectable()
export class RmqService {
  private readonly rmqUri: string;

  constructor(private readonly configService: ConfigService) {
    this.rmqUri = this.configService.get<string>(
      'RABBIT_MQ_URI',
      `amqp://${configService.get<string>('RABBITMQ_DEFAULT_USER')}:${configService.get<string>('RABBITMQ_DEFAULT_PASS')}@${configService.get<string>('RABBITMQ_HOST')}:${configService.get<number>('RABBITMQ_PORT')}`,
    );
  }

  getOptions(queue: string): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.rmqUri],
        queue: this.configService.get<string>(
          `RABBIT_MQ_${queue}_QUEUE`,
          `${queue}`,
        ),
        noAck: false,
        prefetchCount: 10, // Prevent worker flooding
        queueOptions: {
          durable: true,
        },
      },
    };
  }

  /**
   * Acknowledge message
   */
  ack(context: RmqContext): void {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    if (channel && originalMessage) {
      channel.ack(originalMessage);
    }
  }

  /**
   * Reject message
   * requeue=false → goes to DLX
   */
  nack(context: RmqContext, requeue = false): void {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    if (channel && originalMessage) {
      channel.nack(originalMessage, false, requeue);
    }
  }

  /**
   * Publish message manually (for retry/backoff)
   */
  publish(
    channel: Channel,
    exchange: string,
    routingKey: string,
    message: any,
    headers: Record<string, any> = {},
  ): void {
    channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      {
        headers,
        persistent: true,
      },
    );
  }
}