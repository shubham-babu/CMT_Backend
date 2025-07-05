import { TranslateOptions } from 'nestjs-i18n';
import { I18nPath } from './i18n.translate';

export interface ITranslateService {
  translate: (key: I18nPath, options?: TranslateOptions) => Promise<string>;
}
