import { IsString, IsNotEmpty } from 'class-validator';
import { IResendOTPPayload } from '@repo/shared/interfaces';
import { IsLocalPhone } from '../../../decorators';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ResendOtpDto implements IResendOTPPayload {
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  diaCode: string;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsLocalPhone({ message: i18nValidationMessage('validation.LOCAL_PHONE') })
  phone: string;
}
