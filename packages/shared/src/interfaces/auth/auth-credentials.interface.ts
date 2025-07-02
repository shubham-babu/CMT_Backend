import { ROLES } from "../../enums";

export interface IAuthCredentials {
  phone: string;
  email: string;
  password: string;
  name: string;
  role: ROLES;
}
