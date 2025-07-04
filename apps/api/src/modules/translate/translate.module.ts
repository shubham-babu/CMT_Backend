import { Module } from '@nestjs/common';
import { TRANSLATE_SERVICE } from './interfaces';
import { ConfigModule } from '@nestjs/config';
import { TranslateService } from './services';
import { RequestContextModule } from '../request-context';

@Module({
  imports: [ConfigModule, RequestContextModule],
  providers: [{ provide: TRANSLATE_SERVICE, useClass: TranslateService }],
  exports: [TRANSLATE_SERVICE],
})
export class TanslateModule {}
