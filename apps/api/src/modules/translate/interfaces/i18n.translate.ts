import { Path } from 'nestjs-i18n';
export type I18nTranslations = {
  auth: {
    invalid: {
      phone: string;
      verificationCode: string;
      credentials: string;
    };
    success: {
      login: string;
      signup: string;
      verificationCode: string;
      refreshToken: string;
    };
    notFound: {
      user: string;
    };
  };
  validation: {
    NOT_EMPTY: string;
    INVALID_EMAIL: string;
    INVALID_BOOLEAN: string;
    MIN: string;
    MAX: string;
    PASSWORD: string;
    STRING: string;
    POSSITIVE: string;
    MAX_LENGTH: string;
    ENUM: string;
    LOCAL_PHONE: string;
  };
};
export type I18nPath = Path<I18nTranslations>;
