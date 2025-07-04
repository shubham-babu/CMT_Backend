import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsEmail,
  IsPositive,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { ROLES } from '@repo/shared/enums';
import { IUserCreatePayload } from '@repo/shared/interfaces';
import { IsLocalPhone } from './../../../decorators';
import {
  MAX_EMAIL_LENGTH,
  MAX_NAME_LENGTH,
  POSSWORD_VALIDATION_REGEX,
} from '@repo/shared/constants';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto implements IUserCreatePayload {
  @IsPositive({ message: i18nValidationMessage('validation.POSSITIVE') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  countryId: number;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsLocalPhone({ message: i18nValidationMessage('validation.LOCAL_PHONE') })
  phone: string;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  @MaxLength(MAX_EMAIL_LENGTH)
  email: string;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @Length(8, 16)
  @Matches(POSSWORD_VALIDATION_REGEX, {
    message: i18nValidationMessage('validation.PASSWORD'),
  })
  password: string;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @MaxLength(MAX_NAME_LENGTH, {
    message: i18nValidationMessage('validation.MAX_LENGTH'),
  })
  name: string;

  @IsString({ message: i18nValidationMessage('validation.STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  @IsEnum(ROLES, { message: i18nValidationMessage('validation.ENUM') })
  role: ROLES;
}
