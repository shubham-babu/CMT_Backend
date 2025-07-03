import { ROLES, USER_STATUS } from "../../enums";

export interface IUserResponse {
  id: number;
  diaCode: string
  phone: string;
  email: string;
  name: string;
  role: ROLES;
  status: USER_STATUS
}
