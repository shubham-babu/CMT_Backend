import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConfig, setupSwagger } from './config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const server = await NestFactory.create(AppModule);
  const config = getConfig(server);
  setupSwagger(server);
  server.useGlobalPipes(new ValidationPipe({ transform: true }));

  await server.listen(config.port);
}
bootstrap();
