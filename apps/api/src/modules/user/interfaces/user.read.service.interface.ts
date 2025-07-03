import { User } from '../entities';

export interface IUserReadService {
  findUserByPhone: (phone: string, diaCode?: string) => Promise<User>;
}
