import { Module, Global, DynamicModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RmqService } from './rmq.service';

interface RmqModuleOptions {
  name: string;
}

@Global() // ✅ Make RmqModule available throughout the app
@Module({
  imports: [ConfigModule],
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register({ name }: RmqModuleOptions): DynamicModule {
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            imports: [ConfigModule], // Ensure ConfigModule is available
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [
                  `amqp://${configService.get<string>('RABBITMQ_DEFAULT_USER')}:${configService.get<string>('RABBITMQ_DEFAULT_PASS')}@${configService.get<string>('RABBITMQ_HOST')}:${configService.get<number>('RABBITMQ_PORT')}`,
                ],
                queue: `${name}s`,
                queueOptions: { durable: true },
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      providers: [RmqService],
      exports: [ClientsModule, RmqService], // ✅ Ensure RmqService is exported
    };
  }
}
