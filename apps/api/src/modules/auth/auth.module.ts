import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities';
import { AuthController } from './controllers';
import { AuthWriteService } from './services';
import { AUTH_WRITE_SERVICE } from './interfaces';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './guards';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), ConfigModule],
  controllers: [AuthController],
  providers: [
    { provide: AUTH_WRITE_SERVICE, useClass: AuthWriteService },
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Make JwtAuthGuard a global guard
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard, // Make RolesGuard a global guard
    },
  ],
  exports: [JwtStrategy, AUTH_WRITE_SERVICE],
})
export class AuthModule {}
