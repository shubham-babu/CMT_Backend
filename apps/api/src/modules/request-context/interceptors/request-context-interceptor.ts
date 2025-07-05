import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { IRequestContext, REQUEST_CONTEXT_INTERFACE } from '../interfaces';

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  constructor(
    @Inject(REQUEST_CONTEXT_INTERFACE)
    private readonly contextService: IRequestContext,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user?.id || req.headers['x-user-id'];
    const requestId = req.headers['x-request-id'] as string;
    const lang = req.headers['accept-language']?.split(',')[0] || 'en';

    return new Observable((subscriber) => {
      this.contextService.run({ userId, requestId, lang }, () => {
        next.handle().subscribe({
          next: (val) => subscriber.next(val),
          error: (err) => subscriber.error(err),
          complete: () => subscriber.complete(),
        });
      });
    });
  }
}
