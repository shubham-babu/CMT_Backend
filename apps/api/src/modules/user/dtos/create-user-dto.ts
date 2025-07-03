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

export class CreateUserDto implements IUserCreatePayload {
  @IsPositive()
  @IsNotEmpty()
  countryId: number;

  @IsString()
  @IsNotEmpty()
  @IsLocalPhone()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(MAX_EMAIL_LENGTH)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 16)
  @Matches(POSSWORD_VALIDATION_REGEX, {
    message:
      'Password must be 8-16 characters long, include uppercase and lowercase letters, a number, and a special character (@ # ? ]).',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_NAME_LENGTH)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ROLES)
  role: ROLES;
}
