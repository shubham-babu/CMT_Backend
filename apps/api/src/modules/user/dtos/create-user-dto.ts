import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsEmail,
  IsPositive,
} from 'class-validator';
import { ROLES } from '@repo/shared/enums';
import { IUserCreatePayload } from '@repo/shared/interfaces';
import { IsLocalPhone } from './../../../decorators';

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
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ROLES)
  role: ROLES;
}
