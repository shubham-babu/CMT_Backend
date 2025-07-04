import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConfig, setupSwagger } from './config';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const server = await NestFactory.create(AppModule);
  const config = getConfig(server);
  setupSwagger(server);
  server.useGlobalPipes(
    new I18nValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  server.useGlobalFilters(new I18nValidationExceptionFilter());
  await server.listen(config.port);
}
bootstrap();
