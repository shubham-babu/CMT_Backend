import {
  IUserCreatePayload,
  IBaseResponse,
  IUserResponse,
  IUserVerifyCodePayload,
  ILoginPayload,
  IAuthResponse,
  IResendOTPPayload,
  IRefreshTokenPayload,
} from '@repo/shared/interfaces';

export interface IAuthWriteService {
  signUp: (
    payload: IUserCreatePayload,
  ) => Promise<IBaseResponse<IUserResponse>>;
  verifyCode: (
    payload: IUserVerifyCodePayload,
  ) => Promise<IBaseResponse<IUserResponse>>;
  login: (payload: ILoginPayload) => Promise<IBaseResponse<IAuthResponse>>;
  resendOtp: (
    payload: IResendOTPPayload,
  ) => Promise<IBaseResponse<Record<string, string>>>;
  refreshTokens: (
    payload: IRefreshTokenPayload,
  ) => Promise<IBaseResponse<IAuthResponse>>;
}
