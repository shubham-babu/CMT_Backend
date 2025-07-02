import { IAuthCredentials, IBaseResponse, IRequestUser } from "@repo/shared/interfaces";

export interface IAuthWriteService {
  signUp: (payload: IAuthCredentials)=> Promise<IBaseResponse<IRequestUser>>
}
