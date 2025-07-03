import {
  IUserCreatePayload,
  IBaseResponse,
  IUserResponse,
  IUserVerifyCodePayload,
} from '@repo/shared/interfaces';

export interface IUserWriteService {
  signUp: (
    payload: IUserCreatePayload,
  ) => Promise<IBaseResponse<IUserResponse>>;
  verifyCode: (
    payload: IUserVerifyCodePayload,
  ) => Promise<IBaseResponse<IUserResponse>>;
}
