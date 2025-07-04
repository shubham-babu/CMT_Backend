import { Inject, Injectable } from '@nestjs/common';
import { ITranslateService } from '../interfaces';
import { I18nService, TranslateOptions } from 'nestjs-i18n';
import { REQUEST_CONTEXT_INTERFACE } from 'src/modules/request-context/interfaces';
import { RequestContextService } from 'src/modules/request-context/services';

@Injectable()
export class TranslateService implements ITranslateService {
  constructor(
    private readonly i18n: I18nService,
    @Inject(REQUEST_CONTEXT_INTERFACE)
    private readonly reqContext: RequestContextService,
  ) {}

  public translate = async (
    key: string,
    options?: TranslateOptions,
  ): Promise<string> => {
    const resolvedLang = options?.lang || this.reqContext.getLang() || 'en';

    return await this.i18n.translate(key, {
      ...options,
      lang: resolvedLang,
    });
  };
}
