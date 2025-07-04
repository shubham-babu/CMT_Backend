import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { RequestContextInterceptor } from './interceptors';
import { REQUEST_CONTEXT_INTERFACE } from './interfaces';
import { RequestContextService } from './services';

@Module({
  providers: [
    { provide: REQUEST_CONTEXT_INTERFACE, useClass: RequestContextService },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestContextInterceptor,
    },
  ],
  exports: [REQUEST_CONTEXT_INTERFACE],
})
export class RequestContextModule {}
