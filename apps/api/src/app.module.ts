import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RedisConfigService, TypeOrmConfigService } from './config';
import {
  UserModule,
  CountryModule,
  TwilioModule,
  RequestContextModule,
} from './modules';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './config/jwt.config';
import { I18nModule, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, './../../../../.env'),
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        'en-*': 'en',
      },
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      typesOutputPath: path.join(
        __dirname,
        '../src/generated/i18n.generated.ts',
      ),
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale'] }, // e.g., ?lang=fr
        AcceptLanguageResolver, // uses Accept-Language header
      ],
    }),
    RequestContextModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    NestRedisModule.forRootAsync({
      imports: [ConfigModule],
      useClass: RedisConfigService,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
    }),
    UserModule,
    CountryModule,
    TwilioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
