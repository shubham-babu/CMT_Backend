import { IsString, IsNotEmpty } from 'class-validator';
import { IRefreshTokenPayload } from '@repo/shared/interfaces';

export class RefreshTokenDto implements IRefreshTokenPayload {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
