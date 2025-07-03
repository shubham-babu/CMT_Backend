import { IsString, IsNotEmpty } from 'class-validator';
import { IUserVerifyCodePayload } from '@repo/shared/interfaces';
import { IsLocalPhone } from './../../../decorators';

export class VerifyCodeDto implements IUserVerifyCodePayload {
  @IsString()
  @IsNotEmpty()
  diaCode: string;

  @IsString()
  @IsNotEmpty()
  @IsLocalPhone()
  phone: string;

  @IsString()
  @IsNotEmpty()
  code: string;
}
