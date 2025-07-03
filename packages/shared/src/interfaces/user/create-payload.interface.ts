import { ROLES } from '../../enums';

export interface IUserCreatePayload {
  countryId: number;
  phone: string;
  email: string;
  password: string;
  name: string;
  role: ROLES;
}
