import { IsString, IsNotEmpty, IsEnum, IsEmail, IsPhoneNumber } from "class-validator";
import { ROLES } from '@repo/shared/enums';
import { IAuthCredentials } from '@repo/shared/interfaces';

export class CreateUserDto implements IAuthCredentials {
  @IsString()
  @IsNotEmpty()
  countryId: number;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
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
