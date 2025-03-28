import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';


async function bootstrap() {
  // Create an HTTP-based API Gateway app
  const app = await NestFactory.create(ApiGatewayModule);
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  
  // Enable CORS (optional)
  app.enableCors();
  
  // Start both HTTP and Microservice
  await app.startAllMicroservices();
  await app.listen(3000);

  console.log('🚀 API Gateway running on http://localhost:3000');
}

bootstrap();
