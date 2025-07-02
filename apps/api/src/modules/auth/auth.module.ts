import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { AuthController } from './controllers';
import { AuthWriteService } from './services';
import { AUTH_READ_SERVICE, AUTH_WRITE_SERVICE } from './interfaces';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './guards';
import { AuthReadService } from './services/auth.read.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule],
  controllers: [AuthController],
  providers: [
    { provide: AUTH_WRITE_SERVICE, useClass: AuthWriteService },
    { provide: AUTH_READ_SERVICE, useClass: AuthReadService },
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
  exports: [JwtStrategy, AUTH_WRITE_SERVICE, AUTH_READ_SERVICE],
})
export class AuthModule {}
