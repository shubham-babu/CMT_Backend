import { User } from "../entities";

export interface IAuthReadService {
  findUserByPhoneOrEmail: (phone: string, email: string)=> Promise<User>
}
