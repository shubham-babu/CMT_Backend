import { IAuthResponse } from './auth-response.interface';

export interface IRefreshTokenPayload
  extends Omit<IAuthResponse, 'accessToken' | 'exp'> {}
