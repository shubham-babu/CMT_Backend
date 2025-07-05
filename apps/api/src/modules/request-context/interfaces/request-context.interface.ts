import type { IRequestContextData } from './request-context-data.interface';

export interface IRequestContext {
  run(context: IRequestContextData, callback: () => void): void;
  get(
    key: keyof IRequestContextData,
  ): IRequestContextData[keyof IRequestContextData];
  getLang: () => string;
}
