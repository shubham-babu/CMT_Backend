import type { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const getConfig = (app: INestApplicationContext) => {
  const configService = app.get(ConfigService);
  const port = configService.get('API_PORT') ?? 8080;
  return { port };
};
