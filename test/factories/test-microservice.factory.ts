import { Test } from '@nestjs/testing';
import { INestMicroservice } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

export async function createTestMicroservice(module: any): Promise<INestMicroservice> {
  const moduleRef = await Test.createTestingModule({
    imports: [module],
  }).compile();

  const app = moduleRef.createNestMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'test_queue',
      noAck: false,
    },
  });

  await app.listen();
  return app;
}
