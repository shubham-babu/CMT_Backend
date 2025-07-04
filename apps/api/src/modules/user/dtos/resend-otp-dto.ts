import { IsString, IsNotEmpty } from 'class-validator';
import { IResendOTPPayload } from '@repo/shared/interfaces';
import { IsLocalPhone } from '../../../decorators';

export class ResendOtpDto implements IResendOTPPayload {
  @IsString()
  @IsNotEmpty()
  diaCode: string;

  @IsString()
  @IsNotEmpty()
  @IsLocalPhone()
  phone: string;
}
