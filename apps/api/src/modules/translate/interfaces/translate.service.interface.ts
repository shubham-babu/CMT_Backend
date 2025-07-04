import { TranslateOptions } from 'nestjs-i18n';

export interface ITranslateService {
  translate: (key: string, options?: TranslateOptions) => Promise<string>;
}
