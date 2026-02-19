import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export function createTestRMQ(queue: string) {
  return ClientProxyFactory.create({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue,
      queueOptions: { durable: false },
    },
  });
}
