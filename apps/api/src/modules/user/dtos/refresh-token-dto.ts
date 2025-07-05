import { IsString, IsNotEmpty } from 'class-validator';
import { IRefreshTokenPayload } from '@repo/shared/interfaces';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RefreshTokenDto implements IRefreshTokenPayload {
  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  refreshToken: string;
}
