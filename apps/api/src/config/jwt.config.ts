import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  private readonly logger = new Logger(JwtConfigService.name);

  constructor(private readonly configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    try {
      const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
      const expiresIn =
        this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m';
      if (!secret) {
        throw new Error('JWT_ACCESS_SECRET is missing!');
      }

      return {
        global: true,
        secret,
        signOptions: {
          expiresIn,
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
