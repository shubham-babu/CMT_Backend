import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { AuthWriteService } from './services';
import { USER_READ_SERVICE, AUTH_WRITE_SERVICE } from './interfaces';
import { ConfigModule } from '@nestjs/config';
import { JwtUserGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './guards';
import { UserReadService } from './services/user.read.service';
import { CountryModule } from '../country';
import { TwilioModule } from '../twilio';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TanslateModule } from '../translate';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    JwtModule,
    CountryModule,
    TwilioModule,
    TanslateModule,
  ],
  controllers: [AuthController],
  providers: [
    { provide: AUTH_WRITE_SERVICE, useClass: AuthWriteService },
    { provide: USER_READ_SERVICE, useClass: UserReadService },
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtUserGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
  exports: [JwtStrategy, AUTH_WRITE_SERVICE, USER_READ_SERVICE],
})
export class UserModule {}
