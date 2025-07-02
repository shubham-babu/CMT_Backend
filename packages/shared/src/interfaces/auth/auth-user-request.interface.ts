import { ROLES } from "../../enums";

export interface IRequestUser {
  id: number;
  diaCode: string
  phone: string;
  email: string;
  name: string;
  role: ROLES;
}
