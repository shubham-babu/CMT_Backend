import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RedisModuleOptions,
  RedisModuleOptionsFactory,
} from '@nestjs-modules/ioredis';
import { APP_ENV_TYPES } from '@repo/shared/enums';

@Injectable()
export class RedisConfigService implements RedisModuleOptionsFactory {
  private readonly logger = new Logger(RedisConfigService.name);

  constructor(private readonly configService: ConfigService) {}

  createRedisModuleOptions(): RedisModuleOptions {
    try {
      const isLocalEnv: boolean =
        this.configService.get('NODE_ENV') === APP_ENV_TYPES.LOCAL;

      const host = this.configService.get<string>('REDIS_HOST');
      const port = parseInt(this.configService.get<string>('REDIS_PORT'), 10);
      const password = this.configService.get<string>('REDIS_PASSWORD');

      const tls =
        !isLocalEnv && this.configService.get<boolean>('REDIS_TLS_ENABLED');

      return {
        type: 'single',
        options: {
          host,
          port,
          password,
          tls: tls
            ? {
                rejectUnauthorized: false,
              }
            : undefined,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to configure Redis: ${error.message}`);
        throw error;
      }
    }
  }
}
