import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { RmqService } from '@app/common';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Create an HTTP-based API Gateway app
  const app = await NestFactory.create(ApiGatewayModule);
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  
  // Enable CORS (optional)
  app.enableCors();

  // Create a RabbitMQ microservice
  // const rmqService = app.get<RmqService>(RmqService);
  // app.connectMicroservice(rmqService.getOptions('USER_SERVICE'));

  // app.connectMicroservice({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ['amqp://localhost:5672'],
  //     queue: 'USER_SERVICE',
  //     queueOptions: { durable: false },
  //   },
  // });


  // Start both HTTP and Microservice
  await app.startAllMicroservices();
  await app.listen(3000);

  console.log('🚀 API Gateway running on http://localhost:3000');
}

bootstrap();
