import {
  IUserCreatePayload,
  IBaseResponse,
  IUserResponse,
  IUserVerifyCodePayload,
  ILoginPayload,
  IAuthResponse,
} from '@repo/shared/interfaces';

export interface IUserWriteService {
  signUp: (
    payload: IUserCreatePayload,
  ) => Promise<IBaseResponse<IUserResponse>>;
  verifyCode: (
    payload: IUserVerifyCodePayload,
  ) => Promise<IBaseResponse<IUserResponse>>;
  login: (payload: ILoginPayload) => Promise<IBaseResponse<IAuthResponse>>;
}
