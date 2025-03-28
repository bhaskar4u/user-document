import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Create an HTTP-based API Gateway app
  const app = await NestFactory.create(ApiGatewayModule);
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  
  
  // Enable CORS (optional)
  app.enableCors();
  
  const config = new DocumentBuilder()
  .setTitle('API Documentation')
  .setDescription('This is the API documentation for all endpoints')
  .setVersion('1.0')
  .addBearerAuth() // JWT auth if required
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  // Start both HTTP and Microservice
  await app.startAllMicroservices();
  await app.listen(3000);

  console.log('🚀 API Gateway running on http://localhost:3000');
}

bootstrap();
