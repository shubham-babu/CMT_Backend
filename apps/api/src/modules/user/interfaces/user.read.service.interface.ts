import { IRequestUser } from '@repo/shared/interfaces';
import { User } from '../entities';

export interface IUserReadService {
  findUserByPhone: (phone: string, diaCode?: string) => Promise<User>;
  mapUserToResponse: (user: User) => IRequestUser;
  findById: (id: number) => Promise<User>;
}
