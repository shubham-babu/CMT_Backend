import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

import { IRequestContext, IRequestContextData } from '../interfaces';

@Injectable()
export class RequestContextService implements IRequestContext {
  private readonly storage = new AsyncLocalStorage<IRequestContextData>();

  run = (context: IRequestContextData, callback: () => void) => {
    this.storage.run(context, callback);
  };

  get = <T extends keyof IRequestContextData>(
    key: T,
  ): IRequestContextData[T] => {
    return this.storage.getStore()?.[key];
  };

  getLang = () => this.storage.getStore()?.lang;
}
