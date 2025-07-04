import { IsString, IsNotEmpty } from 'class-validator';
import { ILoginPayload } from '@repo/shared/interfaces';
import { IsLocalPhone } from './../../../decorators';

export class LoginDto implements ILoginPayload {
  @IsString()
  @IsNotEmpty()
  diaCode: string;

  @IsString()
  @IsNotEmpty()
  @IsLocalPhone()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
