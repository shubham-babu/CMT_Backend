import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { APP_ENV_TYPES } from '@repo/shared/enums';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private readonly logger = new Logger(TypeOrmConfigService.name);
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    try {
      const isLocalEnv: boolean =
        this.configService.get('NODE_ENV') === APP_ENV_TYPES.LOCAL;

      return {
        type: 'postgres',
        host: this.configService.get('DB_HOST'),
        port: parseInt(this.configService.get('DB_PORT'), 10),
        username: this.configService.get('DB_USER_NAME'),
        password: this.configService.get('DB_PASSWORD'),
        database: this.configService.get('DATABASE_NAME'),
        synchronize: !!this.configService.get('DB_SYNCHRONIZE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        ssl: isLocalEnv ? undefined : false,
        extra: isLocalEnv
          ? undefined
          : {
              ssl: {
                rejectUnauthorized: false,
              },
            },
      };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to connect to database: ${error.message}`);
        throw error;
      }
    }
  }
}
