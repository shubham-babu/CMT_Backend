import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { UserController } from './controllers';
import { UserWriteService } from './services';
import { USER_READ_SERVICE, USER_WRITE_SERVICE } from './interfaces';
import { ConfigModule } from '@nestjs/config';
import { JwtUserGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './guards';
import { UserReadService } from './services/user.read.service';
import { CountryModule } from '../country';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule, CountryModule],
  controllers: [UserController],
  providers: [
    { provide: USER_WRITE_SERVICE, useClass: UserWriteService },
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
  exports: [JwtStrategy, USER_WRITE_SERVICE, USER_READ_SERVICE],
})
export class UserModule {}
