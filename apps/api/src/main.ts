import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConfig } from './config';

async function bootstrap() {
  const server = await NestFactory.create(AppModule);
  const config = getConfig(server);
  // setupSwagger(server);

  await server.listen(config.port);
}
bootstrap();
